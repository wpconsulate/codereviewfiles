<?php

namespace Dmark\DMForms;

use \Illuminate\Support\Facades\Facade;

class DMFormsFacade extends Facade {

    protected static function getFacadeAccessor()
    {
        return 'bootstrap4-form';
    }

}
