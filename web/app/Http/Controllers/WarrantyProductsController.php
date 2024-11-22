<?php

namespace App\Http\Controllers;

use App\Lib\WarrantyCreator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WarrantyProductsController extends Controller
{
    public function createWarrantyProduct(Request $request)
    {
        /** @var AuthSession */
        $session = $request->get('shopifySession'); // Provided by the shopify.auth middleware, guaranteed to be active
        $productParams = $request->get('warrantyUpsell');
        $success = $code = $error = null;
        $warrantyID = '';
        try {
            $warrantyID = WarrantyCreator::call($session, $productParams);
            $success = true;
            $code = 200;
            $error = null;
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

            Log::error("Failed to create products: $error");
        }
        finally {
            return response()->json(["success" => $success, "error" => $error], $code);
        }
    }
}
