export default class ItemModel{
    constructor(id,item_name,qty,unit_price) {
        this._id = id;
        this._item_name = item_name;
        this._qty = qty;
        this._unit_price = unit_price;
    }
    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get item_name() {
        return this._item_name;
    }

    set item_name(value) {
        this._item_name = value;
    }

    get qty() {
        return this._qty;
    }

    set qty(value) {
        this._qty = value;
    }

    get unit_price() {
        return this._unit_price;
    }

    set unit_price(value) {
        this._unit_price = value;
    }
}