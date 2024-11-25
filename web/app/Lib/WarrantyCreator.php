<?php

//declare(strict_types=1);

namespace App\Lib;

use App\Exceptions\ShopifyProductCreatorException;
use Shopify\Auth\Session;
use Shopify\Clients\Graphql;
use Shopify\Clients\HttpResponse;

class WarrantyCreator
{
    private const CREATE_PRODUCT_MUTATION = <<<'QUERY'
    mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
            product {
                id
                variants(first: 10) {
                            edges {
                                node {
                                    id
                                }
                            }
                        }
            }
        }
    }
    QUERY;

    private const CREATE_PRODUCT_VARIANT_PRICE_MUTATION = <<<'QUERY'
    mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
        productVariantsBulkUpdate(productId: $productId, variants: $variants) {
            productVariants {
                id
                price
            }
            userErrors {
                field
                message
            }
        }
    }
QUERY;

    public static function call(Session $session, array $productDetails)
    {
        $client = new Graphql($session->getShop(), $session->getAccessToken());
        $response1 = $client->query(
            [
                "query" => self::CREATE_PRODUCT_MUTATION,
                "variables" => [
                    "input" => [
                        "title" => $productDetails['policyName'] . ' (' . $productDetails['typeOfUpSell'] . ')',
                        "descriptionHtml" => '<p><b>DO NOT PURCHASE THE WARRANTY FROM THIS PAGE</b><br><br>Coverage is provided by the store you are purchasing the product from. To make a claim on sell warranty, please visit <a href="#!">Claim Forum</a>. By purchasing this warranty/extended warranty, you are agreeing to .</p>',
                    ],
                ]
            ],
        );
        $body1 = HttpResponse::fromResponse($response1)->getDecodedBody();
        $product = [
            'id' => $body1['data']['productCreate']['product']['id'],
            'variant_id' => $body1['data']['productCreate']['product']['variants']['edges'][0]['node']['id']
        ];

        if ($response1->getStatusCode() !== 200 || isset($body["errors"])) {
            throw new ShopifyProductCreatorException($response1->getBody()->__toString(), $response1);
        }
        $response2 = $client->query(
            [
                "query" => self::CREATE_PRODUCT_VARIANT_PRICE_MUTATION,
                "variables" => [
                    "productId" => $product['id'],
                    "variants" => [
                        "id" => $product['variant_id'],
                        "price" => $productDetails['warrantyPrice'],
                    ]
                ]
            ],
        );
        $body2 = HttpResponse::fromResponse($response2)->getDecodedBody();
        if ($response2->getStatusCode() !== 200 || isset($body2["errors"])) {
            throw new ShopifyProductCreatorException($response2->getBody()->__toString(), $response2);
        }

        return $product;
    }
}
