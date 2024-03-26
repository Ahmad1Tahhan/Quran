<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\File;

class CheckJwtSecretCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'serve:jwt';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check if JWT secret is set and generate one if not';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $envContent = File::get('.env');
        if (!str_contains($envContent, 'JWT_SECRET')) {
            // Generate JWT secret if not exists
            $this->info("JWT secret is not set. Generating JWT secret.");
            $this->call('jwt:secret');
        }else{
            $this->info("JWT secret is already set.");
        }

        $this->call('serve');

        return 0;
    }
}
