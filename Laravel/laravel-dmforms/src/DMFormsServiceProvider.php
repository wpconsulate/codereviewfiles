<?php

namespace Dmark\DMForms;

use Illuminate\Support\ServiceProvider;

class DMFormsServiceProvider extends ServiceProvider {

    protected $defer = true;

    public function register()
    {
        $this->app->singleton('bootstrap4-form', function() {
            return new FormService();
        });
    }

    public function provides()
    {
        return ['bootstrap4-form'];
    }

}
