export default class OrderModel{
    constructor(orderId,customerName,date,total) {
        this._orderId = orderId;
        this._customerName = customerName;
        this._date = date;
        this._total = total;
    }
    get orderId() {
        return this._orderId;
    }

    set orderId(value) {
        this._orderId = value;
    }

    get customerName() {
        return this._customerName;
    }

    set customerName(value) {
        this._customerName = value;
    }

    get date() {
        return this._date;
    }

    set date(value) {
        this._date = value;
    }

    get total() {
        return this._total;
    }

    set total(value) {
        this._total = value;
    }
}