<?php

namespace App\Http\Controllers;

use App\Exceptions\ShopifyProductCreatorException;
use App\Lib\CollectionCreator;
use App\Lib\WarrantyCreator;
use App\Models\WarrantyProducts;
use Illuminate\Http\Request;

class WarrantyExtensionController extends Controller
{
    public function getProductWarranties(Request $request)
    {
        $warranties = null;
        try {
            $warranties = WarrantyProducts::query()
                ->where(['shop' => $request->query('shop'), 'status' => 'enabled'])
                ->whereRaw(
                    "JSON_CONTAINS(applicable_products, JSON_OBJECT('id', ?))",
                    ["gid://shopify/Product/{$request->query('product_id')}"]
                );
            return response()->json(['data' => $warranties->exists() ? $warranties->get() : null]);
        } catch (\Exception $err) {
            Log::error("Failed to update products to database: " . $err->getMessage());
            return response()->json($warranties, 500);
        }
    }
}
