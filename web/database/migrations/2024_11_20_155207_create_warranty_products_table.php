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
    public function up()
    {
        Schema::create('warranty_products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('warranty_id');
            $table->string('name');
            $table->string('type');
            $table->string('duration_number');
            $table->string('duration_unit');
            $table->string('price');
            $table->string('clauses');
            $table->string('applicable_products')->nullable();
            $table->boolean('status')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('warranty_products');
    }
}
