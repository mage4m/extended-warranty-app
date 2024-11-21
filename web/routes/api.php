<?php

use App\Http\Controllers\API\{
    UpsellProductSelectorController,
    UpsellController
};
use App\Http\Controllers\WarrantyProductsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/', function () {
    return "Hello API";
});

/* Wrapping up the routes in middleware to get Shopify session */
Route::middleware(['shopify.auth'])->group(function () {
  
Route::post('/warranty/create', [WarrantyProductsController::class, 'createWarrantyProduct']);
    //! For Upsell
    Route::resource('upsell-policy', UpsellController::class);

    //! For Upsell Products
    Route::resource('upsell_products', UpsellProductSelectorController::class);
    Route::delete('upsell_products-delete', [UpsellProductSelectorController::class, 'destroy']);
});
