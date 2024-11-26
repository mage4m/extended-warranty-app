<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWarrantyProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('warranty_products', function (Blueprint $table) {
            $table->id();
            $table->text('shop');
            $table->string('warranty_id');
            $table->string('warranty_variant_id');
            $table->unsignedBigInteger('collection_id');
            $table->foreign('collection_id')->references('id')->on('warranty_collections');
            $table->string('name');
            $table->string('type');
            $table->string('duration_number');
            $table->string('duration_unit');
            $table->string('price');
            $table->string('clauses');
            $table->string('applicable_products')->nullable();
            $table->enum('status', ['disabled','enabled','recreate'])->default('disabled');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('warranty_products');
    }
}
