<?php

//declare(strict_types=1);

namespace App\Lib;

use App\Exceptions\ShopifyProductCreatorException;
use App\Models\WarrantyCollection;
use Shopify\Auth\Session;
use Shopify\Clients\Graphql;
use Shopify\Clients\HttpResponse;

class CollectionCreator
{
    private const CREATE_COLLECTION_MUTATION = <<<'QUERY'
    mutation createCollectionMetafields($input: CollectionInput!) {
          collectionCreate(input: $input) {
                collection {
                  id
                  metafields(first: 3) {
                    edges {
                      node {
                        id
                        namespace
                        key
                        value
                      }
                    }
                  }
                }
                userErrors {
                  message
                  field
                }
          }
    }
    QUERY;

    private const PRODUCT_COLLECTION_MUTATION = <<<'QUERY'
    mutation collectionAddProducts($id: ID!, $productIds: [ID!]!) {
        collectionAddProducts(id: $id, productIds: $productIds) {
            collection {
                id
                title
                products(first: 10) {
                    nodes {
                        id
                        title
                    }
                }
            }
            userErrors {
                field
                message
            }
        }
    }
QUERY;


    public static function call(Session $session, string $productID)
    {
        $collection_id = WarrantyCollection::query()->where("shop", '=', $session->getShop())->value('collection_id');
        $client = new Graphql($session->getShop(), $session->getAccessToken());
        if (!$collection_id) {
            $response1 = $client->query(
                [
                    "query" => self::CREATE_COLLECTION_MUTATION,
                    "variables" => [
                        "input" => [
                            "title" => "Warranties",
                            "descriptionHtml" => "<p><b>Custom Warranty Collection</b></p>"
                        ],
                    ]
                ],
            );
            $body1 = HttpResponse::fromResponse($response1)->getDecodedBody();
            if ($response1->getStatusCode() !== 200 || isset($body["errors"])) {
                throw new ShopifyProductCreatorException($response1->getBody()->__toString(), $response1);
            }
            $collection_id = $body1['data']['collectionCreate']['collection']['id'];
            $newCollection = new WarrantyCollection();
            $newCollection->shop = $session->getShop();
            $newCollection->collection_id = $collection_id;
            $newCollection->save();
        }
        $response2 = $client->query(
            [
                "query" => self::PRODUCT_COLLECTION_MUTATION,
                "variables" => [
                    "id" => $collection_id,
                    "productIds" => [$productID],
                ]
            ],
        );
        $body2 = HttpResponse::fromResponse($response2)->getDecodedBody();
        if ($response2->getStatusCode() !== 200 || isset($body2["errors"])) {
            throw new ShopifyProductCreatorException($response2->getBody()->__toString(), $response2);
        }

        return WarrantyCollection::query()->where("collection_id", $collection_id)->value('id');
    }
}
