<?php

namespace App\Http\Controllers;

use App\Exceptions\ShopifyProductCreatorException;
use App\Lib\CollectionCreator;
use App\Lib\WarrantyCreator;
use App\Models\WarrantyProducts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Shopify\Rest\Admin2022_04\Collect;

class WarrantyProductsController extends Controller
{

    public function index()
    {
        try {
            $allWarranties = WarrantyProducts::all()->map(function ($warranty) {
                $warranty->clauses = json_decode($warranty->clauses, true);
                $warranty->applicable_products = json_decode($warranty->applicable_products, true);
                return $warranty;
            });
            return response()->json($allWarranties);
        } catch (\Exception $err) {
            Log::error("Failed to update products to database: " . $err->getMessage());
            return response()->json(['error' => 'Failed to update products'], 500);
        }
    }

    public function createWarrantyProduct(Request $request)
    {
        /** @var AuthSession */
        $session = $request->get('shopifySession'); // Provided by the shopify.auth middleware, guaranteed to be active
        $productParams = $request->get('warrantyUpsell');
        $success = $code = $error = null;
        $warrantyIds = '';
        $message = '';
        try {
            $warrantyIds = WarrantyCreator::call($session, $productParams);
            $collectionID = CollectionCreator::call($session, $warrantyIds['id']);
            $success = true;
            $code = 200;
            $error = null;

            $warranty = new WarrantyProducts();
            $warranty->shop = $session->getshop();
            $warranty->warranty_id = $warrantyIds['id'];
            $warranty->warranty_variant_id = $warrantyIds['variant_id'];
            $warranty->collection_id = $collectionID;
            $warranty->name = $productParams['policyName'];
            $warranty->type = $productParams['typeOfUpSell'];
            $warranty->duration_number = $productParams['duration'];
            $warranty->duration_unit = $productParams['daysOrYears'];
            $warranty->price = $productParams['warrantyPrice'];
            $warranty->clauses = !empty($productParams['warrantyClauses']) && is_array($productParams['warrantyClauses'])
                ? json_encode($productParams['warrantyClauses'])
                : json_encode([]);

            $warranty->applicable_products = !empty($productParams['products']) && is_array($productParams['products'])
                ? json_encode($productParams['products'])
                : json_encode([]);

            $warranty->status = 'disabled';
            $warranty->save();
            $message = "Warranty created Successfully!";
        } catch (\Exception $e) {
            $success = false;

            if ($e instanceof ShopifyProductCreatorException) {
                $code = $e->response->getStatusCode();
                $error = $e->response->getDecodedBody();
                if (array_key_exists("errors", $error)) {
                    $error = $error["errors"];
                }
            } else {
                $code = 500;
                $error = $e->getMessage();
            }
            $message = false;
            Log::error("Failed to create products: $error");
        } finally {
            return response()->json(["success" => $success, "error" => $error, "message" => $message], $code);
        }
    }

    public function UpdateClauses(Request $request)
    {
        try {
            $session = $request->get('shopifySession');
            $shop = $session->getShop();
            $warrantyId = $request->id;
            $warrantyClauses = $request->clauses;
            $check = WarrantyProducts::where('shop', $shop)->exists();
            if ($check) {
                WarrantyProducts::where([
                'shop' => $shop,
                'warranty_id' => $warrantyId,
            ])->update(['clauses' => $warrantyClauses]);
            }

            return response()->json(['success' => true, 'message' => 'Clauses updated successfully']);
        } catch (\Exception $err) {
            Log::error("Failed to update clauses to database: " . $err->getMessage());
            return response()->json(['error' => 'Failed to update clauses'], 500);
        }
    }

    public function UpdateProducts(Request $request)
    {
        try {
            $session = $request->get('shopifySession');
            $shop = $session->getShop();
            $warrantyId = $request->id;
            $warrantypProducts = $request->products;
            $check = WarrantyProducts::where('shop', $shop)->exists();
            if ($check) {
                WarrantyProducts::where([
                'shop' => $shop,
                'warranty_id' => $warrantyId,
            ])->update(['applicable_products' => $warrantypProducts]);
            }

            return response()->json(['success' => true, 'message' => 'Products updated successfully']);
        } catch (\Exception $err) {
            Log::error("Failed to update products to database: " . $err->getMessage());
            return response()->json(['error' => 'Failed to update products'], 500);
        }
    }
}
