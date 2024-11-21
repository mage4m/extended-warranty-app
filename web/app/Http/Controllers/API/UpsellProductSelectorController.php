<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\API\UpsellProductSelector;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UpsellProductSelectorController extends Controller
{
     public function index(Request $request)
    {
        $session = $request->get('shopifySession');
        $shop = $session->getShop();

        $upsellData = UpsellProductSelector::where('shop', $shop)->first();

        return $upsellData ? json_decode($upsellData->products, true) : [];
    }


    public function store(Request $request)
    {
        $session = $request->get('shopifySession');
        $shop = $session->getShop();
        $Products = $request->productId;
        $check = UpsellProductSelector::where('shop', $shop)->exists();

        if ($check) {
            UpsellProductSelector::where('shop', $shop)->update(['products' => $Products]);
        } else {
            // Save new record
            UpsellProductSelector::insert(['shop' => $shop, 'products' => json_encode($Products)]);
        }

        return [
            'products' => $Products,
            'message' => 'Products saved successfully.'
        ];
    }

     public function destroy(Request $request)
    {
        try {
            dd($request->all());
            $Products = $request->productId;
            $deleteUpsellProducts = UpsellProductSelector::findOrFail($Products);
            $deleteUpsellProducts->delete();

            return response()->json(['products' => $Products,
            'message' => 'Products delete successfully.'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Server error', 'details' => $e->getMessage()], 500);
        }
    }
}
