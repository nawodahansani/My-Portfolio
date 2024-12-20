import CustomerModel from "../model/CustomerModel.js";
import {customer_array} from "../db/database.js";
import {loadCustomerMoble} from "./OrderController.js";

    /*LOARD TABLE*/
const loadCustomerTable = () => {
    $("#customer_table").empty();
    customer_array.map((item,index) => {

        let data =
            `<tr>
                <td>${item.first_name}</td>
                <td>${item.last_name}</td>
                <td>${item.mobile}</td>
                <td>${item.email}</td>
                <td>${item.address}</td>
                </tr>`;
        $("#customer_table").append(data);
    } )
};
    /*CLEAR INPUT*/
function clearCustomerForm(){
    $('#firstName').val("");
    $('#lastName').val("");
    $('#mobileNumber').val("");
    $('#email').val("");
    $('#address').val("");
}
    /*CLEAR CUSTOMER BTN*/
$("#clear_customer").on('click',function (){
    clearCustomerForm();
});
    /*SAVE CUSTOMER BTN*/
$("#add_customer").on('click', function () {
    let first_name = $('#firstName').val();
    let last_name = $('#lastName').val();
    let mobile = $('#mobileNumber').val();
    let email = $('#email').val();
    let address = $('#address').val();

    /*Validation*/
    if (first_name.length===0){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please Enter First Name!",
        });
    }else if (last_name.length===0){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please Enter Last Name!",
        });
    }else if (!validateEmail(email)){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Invalid Email!",
        });
    }else if (!validateMobile(mobile)){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Invalid Mobile Number!",
        });
    }else if (address.length===0){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please Enter Address!",
        });
    }else {
            /*ADD INPUT TO AN OBJECT*/
        let customer = new CustomerModel(
            customer_array.length + 1,
            first_name,
            last_name,
            mobile,
            email,
            address);

        customer_array.push(customer);
        $('#customerCount').text(customer_array.length);

        Swal.fire({
            position: "top-center",
            icon: "success",
            title: "Customer has been saved",
            showConfirmButton: false,
            timer: 1000
        });
        loadCustomerMoble();
        clearCustomerForm();
        loadCustomerTable();
    }
});

const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

const validateMobile = (mobile) => {
    const sriLankanMobileRegex = /^(?:\+94|0)?7[0-9]{8}$/;
    return sriLankanMobileRegex.test(mobile);
}

let selected_customer_index = null;

    /*GET CUSTOMER FROM TABLE*/
$('#customer_table').on('click','tr',function (){
    let index = $(this).index();
    console.log(index);
    selected_customer_index = index;

    let customer_obj = customer_array[index];
    console.log(customer_obj);

    let first_name = customer_obj.first_name;
    let last_name = customer_obj.last_name;
    let mobile = customer_obj.mobile;
    let email = customer_obj.email;
    let address = customer_obj.address;

    $('#firstName').val(first_name);
    $('#lastName').val(last_name);
    $('#mobileNumber').val(mobile);
    $('#email').val(email);
    $('#address').val(address);
});

    /*UPDATE CUSTOMER BTN*/
$('#update_customer').on('click',function (){
    let first_name = $('#firstName').val();
    let last_name = $('#lastName').val();
    let mobile = $('#mobileNumber').val();
    let email = $('#email').val();
    let address = $('#address').val();

    clearCustomerForm();
    let index = selected_customer_index;
    console.log(index);

    let customer = new CustomerModel(
        customer_array[index].id,
        first_name,
        last_name,
        mobile,
        email,
        address);
    /*UPDATE CUSTOMER*/
    Swal.fire({
        title: "Do you want to save the changes?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save",
        denyButtonText: `Don't save`
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            customer_array[selected_customer_index] = customer;
            loadCustomerMoble();
            loadCustomerTable();
            Swal.fire("Saved!", "", "success");
        } else if (result.isDenied) {
            Swal.fire("Changes are not saved", "", "info");
        }
    });
});

    /*DELETE CUSTOMER BTN*/
$('#delete_customer').on('click',function (){
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
            customer_array.splice(selected_customer_index,1);
            $('#customerCount').text(customer_array.length);
            loadCustomerMoble();
            clearCustomerForm();
            loadCustomerTable();

            swalWithBootstrapButtons.fire({
                title: "Deleted!",
                text: "Customer has been deleted.",
                icon: "success"
            });
        } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire({
                title: "Cancelled",
                text: "Your customer details are safe :)",
                icon: "error"
            });
        }
        clearCustomerForm();
    });
});