<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WarrantyProducts extends Model
{
    use HasFactory;


    public function getClausesAttribute($value)
    {
        return json_decode($value, true);
    }

    public function getApplicableProductsAttribute($value)
    {
        return json_decode($value, true);
    }
}
