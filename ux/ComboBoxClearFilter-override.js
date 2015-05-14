/*
#LICENSE BEGIN
#LICENSE END
*/



/**
 * ComboBox values filter is not cleared after typeAhead input.
 * So setting values (e.g. on loading forms) fail if
 * forceSelection is set.
 * see: <http://www.sencha.com/forum/showthread.php?239891-Combo-box-type-ahead-filtering-remembers-filter-even-after-combo-box-is-closed>
 * for other workarounds.
 * We use clearfilter on blur, because this is a smal function to override.
 * Maybe more information in <http://stackoverflow.com/questions/14200701/extjs-combo-loses-selected-value-on-store-page-load>
 */


Ext.override( Ext.form.field.ComboBox, {

    beforeBlur: function() {
        this.doQueryTask.cancel();
        this.assertValue();
        var store = this.getStore();
        if (store) {
          store.clearFilter();
          //delete me.lastQuery;  // use "queryCaching: false" instead
        }
    },

});




/*

// original

    beforeBlur: function() {
        this.doQueryTask.cancel();
        this.assertValue();
    },

*/
