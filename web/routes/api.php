<?php

use App\Models\WarrantyProducts;
use App\Http\Controllers\API\{
    UpsellProductSelectorController,
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
    //! warranty routes
    Route::group(['prefix' => 'warranty'], function () {
        Route::get('/get', [WarrantyProductsController::class, 'index']);
        Route::post('/create', [WarrantyProductsController::class, 'createWarrantyProduct']);
        //! Update the Clauses
        Route::put('/clauses/update', [WarrantyProductsController::class, 'UpdateClauses']);
        //! Update the Products
        Route::put('/products/update', [WarrantyProductsController::class, 'UpdateProducts']);
    });
    //! For Upsell Products
    Route::resource('upsell_products', UpsellProductSelectorController::class);
    Route::delete('upsell_products-delete', [UpsellProductSelectorController::class, 'destroy']);
});