<?php

declare(strict_types=1);

namespace App\Lib\Handlers;

use App\Models\WarrantyProducts;
use Illuminate\Support\Facades\Log;
use Shopify\Webhooks\Handler;
use App\Models\Session;

class ProductDeleted implements Handler
{
    public function handle(string $topic, string $shop, array $body): void
    {
        $product_url = "gid://shopify/Product/";
        $product_id = $product_url . $body['id'];
        WarrantyProducts::query()->where('warranty_id', $product_id)->update(['status' => 'recreate']);
    }
}
