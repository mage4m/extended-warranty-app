<?php

namespace App\Http\Controllers;

use App\Lib\WarrantyCreator;
use Illuminate\Http\Request;

class WarrantyProductsController extends Controller
{
    private $dummydata = [
        'name' => 'Warranty Product',
        'price' => '100',
        'type' => 'Warranty',
        'duration_number' => '30',
        'duration_unit' => 'day',
        'clauses' => 'adsfasdfasdf,asdfsadfas',
        'applicable_products' => '1,3,12'

    ];

    public function createWarrantyProduct(Request $request)
    {
        dd($request->json()->all());
        /** @var AuthSession */
        $session = $request->get('shopifySession'); // Provided by the shopify.auth middleware, guaranteed to be active
        $success = $code = $error = null;
        try {
            WarrantyCreator::call($session, 5);
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
        } finally {
            return response()->json(["success" => $success, "error" => $error], $code);
        }
    }
}
