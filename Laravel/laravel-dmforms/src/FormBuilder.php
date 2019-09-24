<?php

namespace Dmark\DMForms;

use Illuminate\Support\ViewErrorBag;

class FormBuilder
{

    private $_attrs = [];

    public function set($key, $value)
    {
        $formatter = 'format' . ucfirst($key);
        if (method_exists($this, $formatter)) {
            $value = $this->$formatter($value);
        }
        $this->attrs[$key] = $value;
    }

    private function formatMethod($value)
    {
        return strtolower($value);
    }

    private function formatFormData($value)
    {
        if (is_object($value) && method_exists($value, 'toArray')) {
            return $value->toArray();
        }
        return $value;
    }

    private function formatOptions($value)
    {
        extract($this->get('optionIdKey', 'optionValueKey'));

        $idKey = $optionIdKey ?? 'id';
        $valueKey = $optionValueKey ?? 'name';

        $options = [];
        foreach ($value as $key => $item) {
            if (is_object($item)) {
                $options[$item->{$idKey}] = $item->{$valueKey};
                continue;
            }
            $options[$key] = $item;
        }
        return $options;
    }

    public function render(): string
    {
        if(isset($this->attrs['render'])){
            $render = $this->attrs['render'];
            $methodName = 'render' . ucfirst($render);
            $output = $this->$methodName();
            $this->resetAttributes();
            return $output;
        }
        return '';
    }

    private function renderFormOpen(): string
    {
        extract($this->get('method', 'url', 'formMultipart', 'formInline', 'autocomplete'));

        if (!$method) {
            $method = 'post';
        }

        $enctype = $formMultipart ? 'multipart/form-data' : null;

        $attrs = $this->buildHtmlAttrs([
            'method' => in_array($method, ['get', 'post']) ? $method : 'post',
            'action' => $url,
            'enctype' => $enctype,
            'autocomplete' => $autocomplete,
            'class' => $formInline ? 'form-inline' : null,
        ]);

        $output = '<form ' . $attrs . '>';

        if ($method !== 'get') {
            $output .= csrf_field();
            if ($method !== 'post') {
                $output .= method_field($method);
            }
        }

        return $output;
    }

    private function renderFormClose(): string
    {
        $this->resetAttributes(true);
        return '</form>';
    }

    private function renderFieldsetOpen(): string
    {
        $output = '<fieldset>';
        extract($this->get('legend'));

        if ($legend) {
            $output .= '<legend>' . $this->getText($legend) . '</legend>';
        }

        return $output;
    }

    private function renderFieldsetClose(): string
    {
        return '</fieldset>';
    }

    private function renderErrors(): string
    {
        $errors = $this->errors()->all();
        if (count($errors) < 1) {
            return '';
        }

        extract($this->get('errorsHeader', 'id'));
        $attrs = $this->buildHtmlAttrs(['class' => 'alert alert-danger', 'role' => 'alert', 'id' => $id]);
        $output = '<div ' . $attrs . '><ul class="list-unstyled">';
        if ($errorsHeader) {
            $output .= '<h4 class="alert-heading">' . $this->getText($errorsHeader) . '</h4>';
        }
        foreach ($errors as $error) {
            $output .= '<li>' . $error . '</li>';
        }
        return $output . '</ul></div>';
    }

    private function renderInput(): string
    {
        $attributes = $this->getInputAttributes();
        $attrs = $this->buildHtmlAttrs($attributes);
        return $this->wrapperInput('<input ' . $attrs . '>');
    }

    private function renderLocation(): string
    {
        $attributes = $this->getInputAttributes();
        $attrs = $this->buildHtmlAttrs($attributes);
        return $this->wrapperLocation('<input ' . $attrs . '>');
    }
    
    private function renderAjaxUpload(): string
    {
        $attributes = $this->getInputAttributes();
        return $this->wrapperAjaxUpload( $attributes );
    }

   

    private function renderSelect(): string
    {
        $this->set('icon', 'fa fa-caret-down');
        extract($this->get('options'));

        $fieldValue = $this->getValue();
        $arrValues = is_array($fieldValue) ? $fieldValue : [$fieldValue];
        $optionsList = '';
        foreach ($options as $value => $label) {
            $attrs = $this->buildHtmlAttrs(['value' => $value, 'selected' => in_array($value, $arrValues)], false);
            $optionsList .= '<option ' . $attrs . '>' . $label . '</option>';
        }

        $attributes = $this->getInputAttributes();
        $attrs = $this->buildHtmlAttrs($attributes);
        return $this->wrapperInput('<select ' . $attrs . '>' . $optionsList . '</select>');
    }


    private function renderCustomSelect(): string
    {
        extract($this->get('options','placeholder', 'icon'));

        $fieldValue = $this->getValue();
        $arrValues = is_array($fieldValue) ? $fieldValue : [$fieldValue];

        $attributes = $this->getInputAttributes();

        $iconHTML = $icon? '<i class="inputicon '.$icon.'" aria-hidden="true"></i>' : '<i class="inputicon fa fa-caret-down" aria-hidden="true"></i>';

        if($placeholder)
            $optionsList = '<span class="placehold">'.$placeholder.'</span>';
        else
            $optionsList = '<span class="placehold"> - Please Select - </span>';

        $optionsList .= '<ul data-target="'.$attributes['id'].'" class="drop">';
        foreach ($options as $value => $label) {
            $selectedClass = in_array($value, $arrValues)?'selected':'';
            $optionsList .= '<li class="' . $selectedClass . '"><a data-val="'.$value.'">' . $label . '</a></li>';
        }
        $optionsList .= '</ul>';
        $optionsList .= '<input type="hidden" id="'.$attributes['id'].'" name="'.$attributes['name'].'" value="'.$attributes['value'].'" />';
        unset($attributes['name']);
        $attributes['id'] = $attributes['id']."-cont";
        
        $attrs = $this->buildHtmlAttrs($attributes);
        
        return $this->wrapperInput('<div ' . $attrs . '>' . $optionsList . $iconHTML . '</div>');
    }

    private function renderTextarea(): string
    {
        $attributes = $this->getInputAttributes();
        $value = $attributes['value'];
        unset($attributes['value']);
        $attrs = $this->buildHtmlAttrs($attributes);
        return $this->wrapperInput('<textarea ' . $attrs . '>' . htmlspecialchars($value) . '</textarea>');
    }

    private function renderCheckbox(): string
    {
        $attributes = $this->getInputAttributes();
        $attrs = $this->buildHtmlAttrs($attributes);
        return $this->wrapperRadioCheckbox('<input ' . $attrs . '>');
    }

    private function renderRadio(): string
    {
        $attributes = $this->getInputAttributes();
        $attrs = $this->buildHtmlAttrs($attributes);
        return $this->wrapperRadioCheckbox('<input ' . $attrs . '>');
    }

    private function renderAnchor(): string
    {
        extract($this->get('url', 'value'));
        $class = $this->getBtnAnchorClasses();
        $attrs = $this->buildHtmlAttrs(['href' => $url, 'class' => $class]);
        return '<a ' . $attrs . '>' . $value . '</a>';
    }

    private function renderButton(): string
    {
        extract($this->get('type', 'value', 'disabled', 'id'));
        $class = $this->getBtnAnchorClasses();
        $attrs = $this->buildHtmlAttrs(['type' => $type, 'class' => $class, 'disabled' => $disabled, 'id'=>$id]);
        return '<button ' . $attrs . '>' . $value . '</button>';
    }

    private function getBtnAnchorClasses()
    {
        extract($this->get('size', 'color', 'outline', 'block', 'type', 'value', 'formInline'));
        return $this->createAttrsList(
            'btn',
            [$size, 'btn-' . $size],
            [$color, 'btn-' . ($outline ? 'outline-' : '') . $color],
            [$block, 'btn-block'],
            [$formInline, 'mx-sm-2']
        );
    }

    private function isRadioOrCheckbox(): bool
    {
        extract($this->get('render'));
        return in_array($render, ['checkbox', 'radio']);
    }

    private function getInputAttributes(): array
    {

        extract($this->get('render', 'identifier', 'type', 'multiple', 'name', 'size', 'placeholder', 'help', 'disabled', 'readonly', 'required', 'autocomplete', 'min', 'max', 'value', 'checked', 'formData', 'disableValidation'));
        $attributes = [];

        $isRadioOrCheckbox = $this->isRadioOrCheckbox();
        $type = $isRadioOrCheckbox ? $render : $type;

        $class = 'form-check-input';

        if (!$isRadioOrCheckbox) {
            $class = 'form-control';
            switch ($type) {
                case 'file':
                    $class .= '-file';
                    break;
                case 'range':
                    $class .= '-range';
                    break;
            }
            if ($size) {
                $class .= ' form-control-' . $size;
            }
        }

        $id = $this->getId();

        if (!$disableValidation && $this->errors()->count() > 0) {
            $class .= $this->errors()->has($name) ? ' is-invalid' : ' is-valid';
        }

        if($identifier == 'select2')
            $class .= " select2";
        if($identifier == 'filecontrol')
            $class .= " filecontrol";
        if($identifier == 'location')
            $class .= " location";
        if($identifier == 'datetime')
            $class .= " datetime";
        if($identifier == 'date')
            $class .= " datefield";
        if($identifier == 'timepicker')
            $class .= " timepicker";
        if($identifier == 'customSelect')
            $class .= " dm-drop";


        if( $identifier == 'date' || $identifier == 'datetime' || $identifier == 'timepicker' ){
            $attributes = ["data-toggle"=>"datetimepicker", "data-target"=>"#".$id];
        }

        $attributes['type'] = $type;
        $attributes['name'] = $name;
        $attributes['id'] = $id;

        if ($render !== 'select') {
            $attributes['value'] = $this->getValue();
        } else {
            $attributes['multiple'] = $multiple;
        }

        // If the field is a hidden field, we don't need add more attributes
        if ($type === 'hidden') {
            return $attributes;
        }

        if ($this->isRadioOrCheckbox()) {
            if ($this->hasOldInput()) {
                $isChecked = old($name) === $value;
            } else {
                $isChecked = isset($formData[$name]) ? $formData[$name] === $value : $checked;
            }
            $attributes['checked'] = $isChecked;
        }
        
        return array_merge($attributes, [
            'class' => $class,
            'min' => $min,
            'max' => $max,
            'autocomplete' => $autocomplete,
            'placeholder' => $this->getText($placeholder),
            'aria-describedby' => $help ? 'help-' . $id : null,
            'disabled' => $disabled,
            'readonly' => $readonly,
            'required' => $required
        ]);
    }

    private function renderLabel(): string
    {
        extract($this->get('label', 'hideLabel', 'formInline', 'render', 'required'));
        
        if($hideLabel) return '';

        $class = in_array($render, ['checkbox', 'radio']) ? 'form-check-label' : '';
        if ($formInline) {
            $class = join(' ', [$class, 'mx-sm-2']);
        }

        $is_required = ($required)?" *":"";
        $id = $this->getId();
        $attrs = $this->buildHtmlAttrs([
            'for' => $id,
            'class' => $class
        ], false);
        return '<label ' . $attrs . '>' . $this->getText($label) . $is_required . '</label>';
    }

    private function getText($key)
    {
        extract($this->get('formLocale'));
        if ($formLocale) {
            return __($formLocale . '.' . $key);
        }
        return $key;
    }

    private function resetAttributes($resetAll = false)
    {
        // Remove all attributes
        if ($resetAll) {
            $this->attrs = [];
            return;
        }

        // Keep attributes which key starting with 'form'
        $this->attrs = array_filter($this->attrs, function ($key) {
            return substr($key, 0, 4) === 'form';
        }, ARRAY_FILTER_USE_KEY);
    }

    private function wrapperInput(string $input): string
    {
        extract($this->get('type', 'help', 'hideLabel', 'wrapperAttrs', 'formInline', 'name', 'size', 'icon', 'field_type', 'value_lat', 'value_lng','file_placeholder'));

        if ($type === 'hidden') {
            return $input;
        }

        $id             = $this->getId();
        $label          = $this->renderLabel();
        $helpText       = $help ? '<small id="help-' . $id . '" class="form-text text-muted">' . $this->getText($help) . '</small>' : '<small class="form-text text-muted">&nbsp;</small>';
        $error          = $this->getInputErrorMarkup($name);
        $attrs          = $wrapperAttrs ?? [];
        $attrs['class'] = $this->createAttrsList(
            $attrs['class'] ?? null,
            'input-group'
        );
        $attributes = $this->buildHtmlAttrs($attrs, false);

        if($hideLabel) $helpText=null;
        
        $wrapperClass = $size ?? 'col-sm-12';
        $iconHTML = $icon ? '<i class="inputicon '.$icon.'" aria-hidden="true"></i>' : null;

        if ($type === 'file') {
            return '<div id="dm-'.$id.'" class="'.$wrapperClass.'">' .
                        '<div class="form-group">' 
                            . $label .
                            '<div ' . $attributes . '>'.
                                '<label for="custom-file-upload" class="filupp m-0">' .
                                    '<span class="filupp-file-name js-value">'.$file_placeholder.'</span>' . 
                                    $input .
                                '</label>'.
                                $iconHTML . 
                            '</div>' . 
                            $helpText . 
                            $error . 
                        '</div>'.
                    '</div>';
        }

        return '<div  id="dm-'.$id.'" class="'.$wrapperClass.'"><div class="form-group">' . $label .'<div ' . $attributes . '>' . $input . $iconHTML . '</div>' . $helpText . $error . '</div></div>';
    }
    
    private function wrapperLocation(string $input): string
    {
        extract($this->get('type', 'help', 'hideLabel', 'wrapperAttrs', 'formInline', 'name', 'size', 'icon', 'field_type', 'value_lat', 'value_lng', 'lat_name', 'lng_name'));

        $id             = $this->getId();
        $label          = $this->renderLabel();
        $helpText       = $help ? '<small id="help-' . $id . '" class="form-text text-muted">' . $this->getText($help) . '</small>' : '<small class="form-text text-muted">&nbsp;</small>';
        $error          = $this->getInputErrorMarkup($name);
        $attrs          = $wrapperAttrs ?? [];
        $attrs['class'] = $this->createAttrsList(
            $attrs['class'] ?? null,
            'input-group'
        );
        $attributes = $this->buildHtmlAttrs($attrs, false);

        if($hideLabel) $helpText=null;

        $wrapperClass = $size ?? 'col-sm-12';
        $iconHTML = $icon? '<i class="inputicon '.$icon.'" aria-hidden="true"></i>' : null;

        $lat_field_name = ($lat_name)?$lat_name:'lat';
        $lng_field_name = ($lng_name)?$lng_name:'lng';

        $latInput = '<input type="hidden" id="lat" class="lat" name="'.$lat_field_name.'" value="'.$value_lat.'" />';
        $lngInput = '<input type="hidden" id="lng" class="lng" name="'.$lng_field_name.'" value="'.$value_lng.'" />';

        return '<div id="dm-'.$id.'" class="'.$wrapperClass.'"><div class="form-group">' . $label .'<div ' . $attributes . '>' . $input . $latInput . $lngInput . $iconHTML . '</div>' . $helpText . $error . '</div></div>';
    }

    private function wrapperRadioCheckbox(string $input): string
    {
        extract($this->get('inline', 'name', 'wrapperAttrs', 'size'));

        $attrs = $wrapperAttrs ?? [];
        $attrs['class'] = $this->createAttrsList(
            'form-check',
            [$inline, 'form-check-inline'],
            $attrs['class'] ?? null
        );
        $attributes = $this->buildHtmlAttrs($attrs, false);
        $label = $this->renderLabel();
        $error = $this->getInputErrorMarkup($name);

        $id             = $this->getId();

        $wrapperClass = $size ?? 'col-sm-12';

        return '<div id="dm-'.$id.'" class="'.$wrapperClass.'"><div class="form-group"><div ' . $attributes . '>' . $input . $label . $error . '</div></div></div>';
    }



    private function wrapperAjaxUpload(array $inputAttr): string
    {
        extract($this->get('type', 'help', 'hideLabel', 'wrapperAttrs', 'formInline', 'name', 'size', 'icon', 'attr', 'placeholder' ));

        $id             = $this->getId();
        $label          = $this->renderLabel();
        $helpText       = $help ? '<small id="help-' . $id . '" class="form-text text-muted">' . $this->getText($help) . '</small>' : '<small class="form-text text-muted">&nbsp;</small>';
        $error          = $this->getInputErrorMarkup($name);
        $attrs          = $wrapperAttrs ?? [];
        $attrs['class'] = $this->createAttrsList(
            $attrs['class'] ?? null,
            'row'
        );
        $attributes = $this->buildHtmlAttrs($attrs, false);


        if($hideLabel) $helpText=null;

        $wrapperClass = $size ?? 'col-sm-12';
        $iconHTML = '<i class="inputicon '.$icon.'" aria-hidden="true"></i>' ?? null;


        $fileAttr   = $attr ?? [];

        $fileAttr = array_merge([
                                    "thumb_col_class" => "col-sm-2",
                                    "thumb_wrapper_class" => "media",
                                    "thumb_class" => "img-circle img-fluid size-60",
                                    "thumb_id" => "img-".$this->getId(),
                                    "input_col_class" => "col-sm-5",
                                    "input_wrapper_class" => "browse",
                                    "input_text" => "Browse",
                                    "input_span_class" => "care-plan-file",
                                    "thumb_class" => "img-circle img-fluid size-60",
                                    "button_col_class" => "col-sm-5",
                                    "button_class" => "btn btn-success cyan-blue-bg",
                                    "button_id" => "btn-".$this->getId(),
                                    "button_text" => "Upload",
                                ], $fileAttr);
        


        $scripts = $this->ajaxUploadScripts( $inputAttr, $fileAttr );

        // pr($placeholder, 1);

        $imgThumb = $placeholder ?? '//via.placeholder.com/100x100';

        $fileInput = '<input '.$this->buildHtmlAttrs(["type"=>$inputAttr['type'], 'name'=>"file-".$inputAttr['name'], "id"=>"file-".$inputAttr['id'] ]).' />';
        $input = '<input '.$this->buildHtmlAttrs(["type"=>'hidden', 'name'=>$inputAttr['name'], "id"=>$inputAttr['id'], "value"=>$inputAttr['value'] ]).' />';


        return '<div id="dm-'.$id.'" class="'.$wrapperClass.'">' .
                    '<div class="form-group file-group">' 
                        . $label .
                        
                        '<div ' . $attributes . '>'.
                            '<div class="'.$fileAttr['thumb_col_class'].'">' .
                                '<div class="filupp-img">' .
                                    '<div class="'.$fileAttr['thumb_wrapper_class'].'">' .
                                        '<img src="'.$imgThumb.'" id="'.$fileAttr['thumb_id'].'" class="'.$fileAttr['thumb_class'].'" />' .
                                    '</div>' .
                                '</div>' .
                            '</div>' .
                            '<div class="'.$fileAttr['input_col_class'].'">' .
                                '<div class="filupp-select '.$fileAttr['input_wrapper_class'].'">' .
                                    '<div class="media-body"><div class="file-upload"><div class="file-select">' .
                                        '<div class="file-select-name"><p>'.$fileAttr['input_text'].'</p><span class="'.$fileAttr['input_span_class'].'"></span></div>' .
                                        $fileInput . $iconHTML . $input .
                                    '</div></div></div>' .
                                '</div>' .
                            '</div>' .
                            '<div class="col-sm-5">' .
                                '<div class="filupp-upload-btn">' .
                                    '<input class="'.$fileAttr['button_class'].'" type="button" id="'.$fileAttr['button_id'].'" value="'.$fileAttr['button_text'].'" disabled/>' .
                                '</div>' .
                            '</div>' .
                        '</div>' .

                        $helpText . 
                        $error . 
                    '</div>'.
                    $scripts .
                '</div>';
    }

    private function ajaxUploadScripts( array $inputAttr, array $fileAttr ): string
    {
        ob_start();
        ?>
            <script>
                window.onload = function() {
                    jQuery("#file-<?php echo $inputAttr['id']?>").change(function(ev){
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            console.log("e",e)
                            jQuery('#<?php echo $fileAttr['thumb_id']?>').attr('src', e.target.result);
                        }
                        reader.readAsDataURL(jQuery(this)[0].files[0]);
                        
                        jQuery('#<?php echo $fileAttr['button_id']?>').prop("disabled", false);
                    });

                };
            </script>
        <?php
        $scripts = ob_get_contents();
        ob_end_clean();
        return $scripts;
    }



    private function getInputErrorMarkup(string $name): string
    {
        extract($this->get('disableValidation'));

        if ($disableValidation) {
            return '';
        }

        $error = $this->errors()->first($name);
        if (!$error) {
            return '';
        }
        return '<div class="invalid-feedback">' . $this->errors()->first($name) . '</div>';
    }

    private function getId()
    {
        extract($this->get('id', 'name', 'formIdPrefix', 'render', 'value'));

        if ($id) {
            return $id;
        }

        return ($formIdPrefix ?? 'inp-') . $name . ($render === 'radio' ? '-' . $value : '');
    }

    private function hasOldInput()
    {
        return count((array) old()) != 0;
    }

    private function getValue()
    {
        extract($this->get('name', 'value', 'formData'));
        if ($this->isRadioOrCheckbox()) {
            return $value;
        }

        if ($this->hasOldInput()) {
            return old($name, $value);
        }
        
        if ($value) {
            return $value;
        }


        return $formData[$name] ?? null;
    }

    private function buildHtmlAttrs(array $attributes, $appendAttrs = true): string
    {
        if ($appendAttrs) {
            extract($this->get('attrs'));
            $fieldAttrs = $attrs ?? [];
            $class = $this->createAttrsList($attributes['class'] ?? null, $fieldAttrs['class'] ?? null);
            if ($class) {
                $attributes['class'] = $class;
            }
            $attributes = array_filter($attributes, function($var){ return ($var)?true:false; });
            $attributes = array_merge($fieldAttrs, $attributes);        
        }

        return join(' ', array_filter(
            array_map(function ($key) use ($attributes) {
                $value = $attributes[$key];
                if (is_bool($value)) {
                    return $value ? $key : '';
                } elseif ($value !== null) {
                    return $key . '="' . htmlspecialchars($value) . '"';
                }
                return '';
            }, array_keys($attributes))
        ));
    }

    private function createAttrsList(...$items)
    {
        $attrs = [];
        foreach ($items as $item) {
            if (is_array($item)) {
                $item = $item[0] ? $item[1] : null;
            }
            $attrs[] = $item;
        }
        return join(' ', array_filter($attrs));
    }

    private function errors()
    {
        $errors = session('errors', app(ViewErrorBag::class));
        extract($this->get('formErrorBag'));
        if ($formErrorBag) {
            $errors = $errors->{$formErrorBag};
        }
        return $errors;
    }

    private function get(...$keys): array
    {
        $return = [];
        foreach ($keys as $key) {
            $return[$key] = $this->attrs[$key] ?? null;
        }
        return $return;
    }
}
