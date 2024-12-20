import {customer_array,item_array,order_array,cart_array} from "../db/database.js";
import OrderModel from "../model/OrderModel.js";
import CustomerModel from "../model/CustomerModel.js";
import ItemModel from "../model/ItemModel.js";
import CartModel from "../model/CartModel.js";
import {loadItemTable} from "./ItemController.js";

/*GENERATE ORDERID*/
const getNextOrderId = () => {
    let id;
    let index = order_array.length;
    if (index>0){
        id = Number(order_array[order_array.length-1].orderId);
    }else {
        id = 0;
    }
    let oid = id+1;
    return oid;
};

    /*LOAD CUSTOMER MOBILE NUMBER*/
export function loadCustomerMoble(){
    $("#customerMobileSelect").empty();
    $("#customerMobileSelect").append('<option>Select Mobile Number</option>');
    customer_array.map((item,index) => {
        let data = `<option>${item.mobile}</option>`;
        $("#customerMobileSelect").append(data);
    });
}

    /*LOAD CUSTOMER NAME*/
$('#customerMobileSelect').on('change',function (){
    let selectMobile = $(this).val();
    let selectCustomer = null;

    for (let i=0;i<customer_array.length;i++){
        if (customer_array[i].mobile == selectMobile){
            selectCustomer = customer_array[i];
        }
    }
    if (selectCustomer){
        $('#customerName').val(`${selectCustomer.first_name} ${selectCustomer.last_name}`);
    }else {
        $('#customerName').val('');
    }
});

    /*LOAD ITEM NAME*/
export function loadItemName(){
    $("#itemNameSelect").empty();
    $("#itemNameSelect").append('<option>Select Item Name</option>');
    item_array.map((item,index) => {
        let data = `<option>${item.item_name}</option>`;
        $("#itemNameSelect").append(data);
    });
}

    /*LOAD ITEM DETAIL*/
$('#itemNameSelect').on('change',function (){
    let selectItemName = $(this).val();
    let selectItem = null;

    for (let i=0;i<item_array.length;i++){
        if (item_array[i].item_name == selectItemName){
            selectItem = item_array[i];
        }
    }
    if (selectItem){
        $('#unitPrice1').val(`${selectItem.unit_price}`);
        $('#qtyOnHand').val(`${selectItem.qty}`);
    }else {
        $('#unitPrice1').val('');
        $('#qtyOnHand').val('');
    }
});

    /*LOAD ORDER DETAIL TABLE*/
const loadOrderDetailTable = () => {
    $("#orderdetail_table").empty();
    order_array.map((item,index) => {
        let data =
            `<tr>
                    <td>${item.orderId}</td>
                    <td>${item.customerName}</td>
                    <td>${item.date}</td>
                    <td>${item.total}</td>
                    <td>
                        <button class="btn btn-danger btn-sm delete-order-btn">Delete</button>
                    </td>
             </tr>`;
        $('#orderdetail_table').append(data);
    });
    $('#orderid').val(getNextOrderId());
}
loadOrderDetailTable();

    /*LOAD CART TABLE*/
const loadCart = () => {
    $("#cart_table").empty();
    cart_array.map((item,index) => {
        let data =
            `<tr>
                <td>${item.itemName}</td>
                <td>${item.qty}</td>
                <td>${item.unitPrice}</td>
                <td>${item.total}</td>
                <td>
                    <button class="btn btn-danger btn-sm delete-btn">Remove</button>
                </td>
            </tr>`
        $('#cart_table').append(data);
    });
    $('#total').val(calculateTotal().toFixed(2));
    $('#subTotal').val(calculateTotal().toFixed(2));
}

    /*CLEAR ITEM DETAIL*/
function clearItemDetail() {
    $('#itemNameSelect').val('Select Item');
    $('#unitPrice1').val('');
    $('#qtyOnHand').val('');
    $('#orderQty').val('');
}
    /*CLEAR ORDER FORM*/
function clearOrderForm() {
     $('#customerMobileSelect').val('select customer');
     $('#customerName').val('');
     clearItemDetail();
     $('#cart_table').empty();
    cart_array.length = 0;
     loadOrderDetailTable();
     orderSummary();
}
    /*CLEAR ORDER SUMMARY*/
function orderSummary() {
    $('#total').val('');
    $('#discount').val('');
    $('#subTotal').val('');
    $('#cash').val('');
    $('#balance').val('');
}

    /*ADD TO CART BTN*/
$("#addToCart").on('click',function (){
    let customerMobile = $('#customerName').val();
    let itemName = $('#itemNameSelect').val();
    let unitPrice = $('#unitPrice1').val();
    let qtyOnHand = parseInt($('#qtyOnHand').val(),10);
    let orderQty = $('#orderQty').val();

    if (customerMobile.length ===0){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please Select Customer!",
        });
    }else if (unitPrice.length === 0){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please Select An Item!",
        });
    }else if (orderQty.length === 0){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please Enter Order Qty!",
        });
    }else if (orderQty > qtyOnHand){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Order Qty Exceeds Available Stock!",
        })
    }else {
        let total = orderQty * unitPrice;

        let index = -1;
        for (let i=0;i<cart_array.length;i++){
            if (cart_array[i].item_name === itemName){
                index = i;
                break;
            }
        }
        if (index!== -1){
            let item = cart_array[index];
            let qty = parseInt(item.qty) + parseInt(orderQty);
            item.qty = qty;
            item.total = item.qty * unitPrice;
            cart_array[index] = item;
            updateQtyOnHand(itemName,orderQty);

        }else {
            let cart = new CartModel(
                itemName,
                orderQty,
                unitPrice,
                total
            );
            cart_array.push(cart);
            updateQtyOnHand(itemName,orderQty);
        }
        clearItemDetail();
        loadCart();
    }
});

    /*UPDATE QTY OF ITEM ARRAY - decrease qty that add to cart from item array */
const updateQtyOnHand = (itemname,orderqty) => {
    let item = null;
    let index = -1;

    for (let i=0;i<item_array.length;i++){
        if (item_array[i].item_name == itemname){
            item = item_array[i];
            index = i;
            break;
        }
    }
    if (item){
        item.qty -= orderqty;
        $('#qtyOnHand').val(item.qty);
    }
    let items = new ItemModel(
        item.id,
        item.item_name,
        item.qty,
        item.unit_price
    );
    item_array[index]=items;
    loadItemTable();
}
    /*REMOVE BTN OF CART*/
$('#cart_table').on('click','.delete-btn',function (){
   const index = $(this).closest('tr').index();
   const itemname = cart_array[index].itemName;
   RemoveCartItem(itemname);
});

const RemoveCartItem = (itemName) => {
  let index = -1;
  let returnQty = 0;
  for (let i=0;i<cart_array.length;i++){
      if (cart_array[i].itemName===itemName){
          index=i;
          returnQty=parseInt(cart_array[i].qty);
          break;
      }
  }
  if (index!==-1){
      cart_array.splice(index,1);
      updateQtyOnHand1(itemName,returnQty);
      loadCart();
      clearItemDetail();
  }
}

/*UPDATE QTY OF ITEM ARRAY - increase qty that remove from cart to item array */
const updateQtyOnHand1 = (itemname,returnqty) => {
  let item = null;
  let index = -1;

  for (let i=0;i<item_array.length;i++){
      if (item_array[i].item_name == itemname){
          item = item_array[i];
          index=i;
          break;
      }
  }
  if (item){
      item.qty += parseInt(returnqty);
  }
  let items = new ItemModel(
      item.id,
      item.item_name,
      item.qty,
      item.unit_price
  );
  item_array[index]=items;
  loadItemTable();
}

    /*CALCULATE TOTAL OF ITEMS*/
const calculateTotal = () => {
  let total = 0;
  for (let i=0;i<cart_array.length;i++){
      total += cart_array[i].total;
  }
  return parseFloat(total);
}

    /*CALCULATE DISCOUNTED TOTAL WHEN INPUT DISCOUNT*/
$('#discount').on('input', function () {
    let discount = parseFloat($('#discount').val()) || 0; // Get the discount value, default to 0
    let total = parseFloat($('#total').val()) || 0; // Get the total value, default to 0

    let discountedTotal;

    if (discount > 0) {
        discountedTotal = total - (total * (discount / 100));
    } else {
        discountedTotal = total; // No discount applied
    }

    $('#subTotal').val(discountedTotal.toFixed(2));
});

    /*CALCULATE BALANCE WHEN ADD CASH*/
$('#cash').on('keydown', function (event) {
    if (event.key === "Enter" || event.keyCode === 13) { // Check if the Enter key is pressed
        event.preventDefault(); // Prevent the default action of the Enter key

        // Get values from input fields
        let cash = parseFloat($('#cash').val()) || 0; // Default to 0 if input is empty or invalid
        let subtotal = parseFloat($('#subTotal').val()) || 0; // Default to 0 if input is empty or invalid

        if (cash < subtotal) {
            Swal.fire({
                icon: "error",
                title: "Insufficient Cash",
                text: "The entered cash amount is less than the subtotal!",
            });
            $('#balance').val(''); // Clear balance field
        } else {
            // Calculate balance
            let balance = cash - subtotal;

            // Update balance field
            $('#balance').val(balance.toFixed(2));
        }
    }
});

    /*SET CURRENT DATE*/
const setCurrentDate = () => {
    const dateField = document.getElementById('date');
    const today = new Date();

    // Format the date to yyyy-mm-dd
    const formattedDate = today.toISOString().split('T')[0];

    // Set the value of the date input field
    dateField.value = formattedDate;
};

// Call the DATE when the page loads
document.addEventListener('DOMContentLoaded', setCurrentDate);

    /*PLACE ORDER BTN*/
$('#placeOrderBtn').on('click',function () {
    let orderId = $('#orderid').val();
    let customername = $('#customerName').val();
    let date = $('#date').val();
    let total = parseFloat($('#subTotal').val()) || 0;

    if (cart_array.length == 0){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please add items before place a order!",
        });
    }else if (customername.length === 0){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please select customer before place a order!",
        });
    }else {
        let order = new OrderModel(
            orderId,
            customername,
            date,
            total
        );
        Swal.fire({
            title: "Do you want to place the order?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Placed Order",
            denyButtonText: `Don't save`
        }).then((result) => {
            if (result.isConfirmed) {
                order_array.push(order);
                clearItemDetail();
                $('#orderCount').text(order_array.length);
                $('#totalRevenue').text(`Rs. ${totalRevenue()}`);
                clearOrderForm();
                Swal.fire("Order Placed!", "Your order has been successfully placed.", "success");
            }else if (result.isDenied){
                Swal.fire("Order Not Saved", "Your order was not saved.", "info");
                restoreQty();
                clearOrderForm();
            }
            clearOrderForm();
        })
    }
});

export const totalRevenue = () => {
  let total = 0;
  for (let i=0;i<order_array.length;i++){
      total += order_array[i].total;
  }
  return parseFloat(total);
}

    /*EWSTORE QTY IF ORDER IS CANCELED*/
const restoreQty = () => {
  for (let i=0;i<cart_array.length;i++){
      let cartItem = cart_array[i];
      let orderQty = cart_array[i].qty;

      let item = null;
      let index = -1;

      for (let j=0;j<item_array.length;j++){
          if (item_array[i].item_name == cartItem.itemName){
              item = item_array[j];
              index = j;
              break;
          }
      }
      if (item){
          item.qty += parseInt(orderQty);
      }
      let items = new ItemModel(
          item.id,
          item.item_name,
          item.qty,
          item.unit_price
      );
      item_array[index]= items;
      loadItemTable();
  }
  cart_array.length = 0;
  loadCart();
  loadOrderDetailTable();
};

    /*DELETE ORDER FROM ORDER DETAIL BODY*/
const deleteOrder = (orderId) => {
  let index = -1 ;
  for (let i = 0; i<order_array.length;i++){
      if (order_array[i].orderId === orderId){
          index = i;
          break;
      }
  }

  if (index !== -1){
      Swal.fire({
          title: "Do you want to delete Order?",
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: "Delete",
          denyButtonText: `Don't delete`
      }).then((result) => {
          if (result.isConfirmed) {
              order_array.splice(index, 1);
              $('#orderCount').text(order_array.length);
              $('#totalRevenue').text(`Rs. ${totalRevenue()}`);
              loadOrderDetailTable();
              Swal.fire("Deleted!", "", "success");
          } else if (result.isDenied) {
              Swal.fire("Order is not deleted", "", "info");
          }
      })
  }
}

    /*DELETE ORDER BTN*/
$('#orderdetail_table').on('click','.delete-order-btn',function (){
    const index = $(this).closest('tr').index();
    const orderId = order_array[index].orderId;
    deleteOrder(orderId);
});

