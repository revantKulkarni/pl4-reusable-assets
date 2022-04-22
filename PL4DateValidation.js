/*
This is a client callable script include
*/

var PL4DateValidation = Class.create();
PL4DateValidation.prototype = Object.extendsObject(AbstractAjaxProcessor, {

    /**
     * @description validate the following 
     * 1. date is not more then 30 days in the future
     * 2. date is not after date to compare
     * 3. date is not before current date
     * @param  {string} sysparm_date is date
     * @param  {string} sysparm_compare_date is date to be compared to selected date field
     * @param  {string} sysparm_max_date is max date
     * @param  {string} sysparm_min_date is min date 
     * @return {BOOL} 
     */

    isDateValid: function () {
        var handleResponse;
        var minDate = this.getParameter('sysparm_min_date');
        var maxDate = this.getParameter('sysparm_max_date');

        var currentDateGdt = new GlideDateTime();
        currentDateGdt.addDaysLocalTime(minDate);

        var currentDate = currentDateGdt.getDate();
        var dateGdt = new GlideDateTime(this.getParameter('sysparm_date'));
        var date = dateGdt.getDate();
        var compareDateGdt = new GlideDateTime(this.getParameter('sysparm_compare_date'));

        var maxValidDate = GlideDateTime.subtract(currentDateGdt, dateGdt).getDayPart();

        if (dateGdt.before(currentDate)) {
            handleResponse = {
                message: 'Date cannot be before today',
                type: 'error',
                isValid: true
            };
            return JSON.stringify(handleResponse);
        }

        if (date.equals(currentDate)) {
            return false;
        }
        if (date.after(compareDateGdt) && compareDateGdt != '') {
            handleResponse = {
                message: 'Date cannot be after ',
                type: 'error',
                isValid: true
            };
            return JSON.stringify(handleResponse);
        }
        if (maxValidDate > maxDate || dateGdt.before(currentDateGdt)) {
            handleResponse = {
                message: 'Cannot exceeed more then ' + maxDate + ' and should not be in past',
                type: 'error',
                isValid: true
            };
            return JSON.stringify(handleResponse);
        }
    },

    /**
     * @description validate if date to compare is before the selected date
     * @param  {string} sysparm_date is date
     * @param  {string} sysparm_compare_date is date to be compared to selected date field
     * @return {BOOL} 
     */

    dateIsAfterToday: function () {
        var handleResponse;
        var dateGdt = new GlideDateTime(this.getParameter('sysparm_date'));
        var compareDateGdt = new GlideDateTime(this.getParameter('sysparm_compare_date'));
        if (compareDateGdt.before(dateGdt)) {
            handleResponse = {
                message: 'Date cannot be in past',
                type: 'error',
                isValid: true
            };
            return JSON.stringify(handleResponse);
        }
    },

    /**
     * @description adding days to a date field
     * @param  {string} sysparm_date is date
     * @param  {string} sysparm_compare_date is date to be compared to selected date field
     * @return added days
     */

    calculateDaysToAdd: function () {
        var daysToAdd = this.getParameter('sys_calculate_days_to_add');
        var date = new GlideDateTime(this.getParameter('sys_date'));
        date.addDaysLocalTime(daysToAdd);
        return date;
    },

    /**
     * @description subtract days to a date field
     * @param  {string} sysparm_date is date
     * @param  {string} sysparm_compare_date is date to be compared to selected date field
     * @return subtracted days
     */

    calculateDaysToSubtract: function () {
        var daysToSubtract = this.getParameter('sys_calculate_days_to_subtract');
        var date = new GlideDateTime(this.getParameter('sys_date'));
        date.addDaysLocalTime(-Math.abs(daysToSubtract));
        return date;
    },

    /**
     * @description add days to a date field from catalog item's delivery date
     * @param  {string} sysparm_date is date
     * @param  {string} sys_catalog_item_id is sys_id of catalog item
     * @return added days 
     */

    getDeliveryDate: function () {
        var date = new GlideDateTime();
        var deliveryDate = new GlideRecord('sc_cat_item');
        deliveryDate.addEncodedQuery('sys_id=' + this.getParameter('sys_catalog_item_id'));
        deliveryDate.query();
        if (deliveryDate.next()) {
            var durationMilliseconds = new GlideDuration(deliveryDate.delivery_time.dateNumericValue()).getNumericValue();
            date.add(durationMilliseconds);
            return date;
        }
    },
    type: 'PL4DateValidation'
});