<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use function Laravel\Prompts\table;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('clients',function(Blueprint $table){
            $table->id();
            $table->string("username")->nullable(true)->min(3)->max(20);
            $table->string("phone_number")->nullable(false)->unique();
            $table->string("role")->nullable(false);
            $table->string("password")->nullable(true);
            $table->string("gender")->nullable(true);
            $table->date  ("birth")->nullable(true);
            $table->string("city")->nullable(true);
            $table->string("work")->nullable(true);
            $table->string("email")->nullable(true);
            $table->integer("otp")->nullable(false);
            $table->longText("image")->nullable(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
