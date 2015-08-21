/*
#LICENSE BEGIN
#LICENSE END
*/




/**
 * Numberfield with format config. (very simple variant)
 * The format config is passed to Ext.util.Format.number
 * This is possible by inherit from
 * 1) Ext.form.field.Number and use setRawValue/getRawValue
 * 2) Ext.form.field.Text and do everything here
 *    including keystroke filtering and so on
 *
 * We first try numberfield.
 *
 * We did NOT test the rawToValue and valueToRaw route.
 *
 * We rely on Ext.util.Format.thousandSeparator and
 * Ext.util.Format.decimalSeparator and that
 * Ext.util.Format.thousandSeparator is equal to Ext.form.field.number.thousandSeparator
 */
Ext.define('Ext.ux.NumberFormatField', {
  extend: 'Ext.form.field.Text',
  alias: 'widget.ux_numberformatfield',
  requires: [ 'Ext.util.Format' ],


  config:{
    format: '0,000.00',
    // avoid invalid char error for thousand separator
    baseChars: '0123456789' + Ext.util.Format.thousandSeparator,
  },

  constructor:function(cfg) {
    this.callParent(arguments);  // Calling the parent class constructor
    this.initConfig(cfg);  // Initializing the component
    this.on('blur',this.onBlur);
    this.on('focus',this.onFocus);
  },



  // remove thousand separator from raw value
  // and normalize decimal separator
  getRawValue: function() {
    var me = this;
    var value = me.callParent();
    value = me.unformatValue(value);
    value = value.replace(Ext.util.Format.decimalSeparator, '.');
    return value;
  },


  // set formatted value
  setValue: function(value) {
    var me = this;
    // first call parent metod to fire events and so on
    // this results in a normal display value without format mask
    var ret = me.callParent([value]);
    // if format is given, then overwrite visible text with formatted value
    if (me.format) {
      value = me.formatValue(value);
      me.setRawValue(value);
    }
    return ret;
  },


  // unformat value
  // remove thousand separator and trailing zeros and trailing decimal separator.
  // this is only used on raw value, so should be a string in all cases.
  unformatValue: function(value) {
    var me = this;
    if (value) {
      value = String(value);
      value = value.replace(Ext.util.Format.thousandSeparator, '');
      var dec = Ext.util.Format.decimalSeparator;
      /*
      if (dec == '.') {
        dec = '\\' + dec;  // escape for regex
      }
      var reg = new RegExp(dec + '0*$', 'g');
      value = value.replace(reg, '');
      */
      // remove trailing zeros and decimal separator
      while (value.length > 0 && value.indexOf(dec) != -1) {
        var lastChar = value.slice(-1);
        if (lastChar == '0' || lastChar == dec) {
          value = value.substr(0, value.length - 1);
        }
        else {
          break;
        }
      }  // eo remove trailing cruft
    }
    return value;
  },

  // format value
  formatValue: function(value) {
    var me = this;
    value = Ext.util.Format.number(value, me.format);
    return value;
  },


  // format on blur
  onBlur: function(cmp, ev, opts) {
    var me = this;
    var value = me.getValue();
    me.setRawValue(me.formatValue(value));
  },

  // unformat on focus
  onFocus: function(cmp, ev, opts) {
    var me = this;
    var value = me.getRawValue();
    // decimal is normalized to '.' by getRawValue,
    // so we have to undo this here for displaying the raw value
    value = value.replace('.', Ext.util.Format.decimalSeparator);
    me.setRawValue(value);
  },



});
