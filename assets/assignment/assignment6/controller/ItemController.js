import ItemModel from "../model/ItemModel.js";
import {customer_array, item_array} from "../db/database.js";
import {loadItemName} from "./OrderController.js";
/*LOAD TABLE*/
export const loadItemTable = () => {
  $("#item_table").empty();
  item_array.map((item,index) => {
      let data =
          `<tr>
                <td>${item.item_name}</td>
                <td>${item.qty}</td>
                <td>${item.unit_price}</td>
                </tr>`;
      $("#item_table").append(data);
  });
}

    /*CLEAR INPUT*/
function clearItemForm(){
    $('#itemName').val("");
    $('#qty').val("");
    $('#unitPrice').val("");
}
    /*CLEAR ITEM BTN*/
$("#clear_item").on('click',function (){
    clearItemForm();
});
    /*SAVE ITEM BTN*/
$("#save_item").on('click',function (){
    let item_name = $('#itemName').val();
    let qty = $('#qty').val();
    let unit_price = $('#unitPrice').val();

    if (item_name.length===0){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please Enter Item Name!",
        });
    }else if (qty.length===0){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please Enter Quantity!",
        });
    }else if (unit_price.length===0){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please Enter UnitPrice!",
        });
    }else {
        let item = new ItemModel(
            item_array.length + 1,
            item_name,
            qty,
            unit_price);
        item_array.push(item);
        $('#itemCount').text(item_array.length);

        Swal.fire({
            position: "top-center",
            icon: "success",
            title: "Item has been saved",
            showConfirmButton: false,
            timer: 1000
        });
        loadItemName();
        clearItemForm();
        loadItemTable();
    }
});

let selected_item_index = null;

    /*GET ITEM FROM TABLE*/
$('#item_table').on('click','tr',function (){
    let index = $(this).index();
    console.log(index);
    selected_item_index = index;

    let item_obj = item_array[index];
    console.log(item_obj);

    let item_name = item_obj.item_name;
    let qty = item_obj.qty;
    let unit_price = item_obj.unit_price;

    $('#itemName').val(item_name);
    $('#qty').val(qty);
    $('#unitPrice').val(unit_price);
});

    /*UPDATE ITEM BTN*/
$('#update_item').on('click',function (){
    let item_name = $('#itemName').val();
    let qty = $('#qty').val();
    let unit_price = $('#unitPrice').val();

    let index = selected_item_index;
    console.log(index);

    let item = new ItemModel(
        item_array[index].id,
        item_name,
        qty,
        unit_price);

    Swal.fire({
        title: "Do you want to save the changes?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save",
        denyButtonText: `Don't save`
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            item_array[selected_item_index] = item;
            loadItemTable();
            clearItemForm();
            loadItemName();
            Swal.fire("Saved!", "", "success");
        } else if (result.isDenied) {
            Swal.fire("Changes are not saved", "", "info");
        }
    });
});

     /*DELETE ITEM BTN*/
$('#delete_item').on('click',function (){
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            item_array.splice(selected_item_index,1);
            $('#itemCount').text(item_array.length);

            clearItemForm();
            loadItemTable();
            loadItemName();

            swalWithBootstrapButtons.fire({
                title: "Deleted!",
                text: "Item has been deleted.",
                icon: "success"
            });
        } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire({
                title: "Cancelled",
                text: "Your item details are safe :)",
                icon: "error"
            });
        }
        clearItemForm();
    });
});