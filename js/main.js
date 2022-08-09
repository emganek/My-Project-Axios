var services = new Services();
var phoneListHTML = document.querySelector("#phoneList .container .row");
var cartArr = [];

// INIT-------------------------------------------------------------------
function getMyEle(id) {
    return document.getElementById(id);
}

window.onscroll = function () {
    if (window.scrollY >= 2) {
        document.getElementById("header").style.backgroundColor = "white";
        document.getElementById("header").style.boxShadow = "0 0 10px 0 rgba(204 204 204 / 50%)"
    }
    else {
        document.getElementById("header").style.backgroundColor = "transparent";
        document.getElementById("header").style.boxShadow = "none"
    }
}

//Tìm kiếm một phần tử trong mảng bằng tên
function findInArrById(id, arrObject) {
    let result = -1;
    arrObject.forEach(function (item, index) {
        if (id == item.product.id) {
            result = index;
        }
    })
    return result;
}
function findInServerArrById(id, arrObject) {
    let result = -1;
    arrObject.forEach(function (item, index) {
        if (id == item.id) {
            result = index;
        }
    })
    return result;
}
//-------------------------------------------------------------------------


//FOR PHONE LIST-----------------------------------------------------------
//Render list phone
function renderList(arr, filterValue) {
    var content = "";
    arr.forEach(function (item) {
        if (filterValue === "none") {
            content += `  
        <div class="col-sm-6 col-lg-3 mb-4 animate__animated animate__fadeIn wow">
            <div class="phoneList-item">
                <div class="card text-center">
                    <div class="phoneList-item-image">
                        <img class="card-img-top" src="${item.img}" alt="Card image">
                        <div class="card-overlay">
                            <p>${item.desc}</p>
                        </div>
                        <button id="addToCartBtn_${item.id}" class="btnStyle-3" onclick="addAction(${item.id})"><i class="fas fa-plus"></i></button>
                    </div>
                    <div class="card-body">
                        <h6>${item.type}</h6>
                        <h4>${item.name}</h4>
                        <p>$${item.price}</p>
                    </div>
                </div>
            </div>
        </div>          
`
        }
        else if (filterValue === "iphone") {
            if (item.type.toLowerCase() === "iphone") {
                content += `  
                <div class="col-sm-6 col-lg-3 mb-4 animate__animated animate__fadeIn wow">
                    <div class="phoneList-item">
                        <div class="card text-center">
                            <div class="phoneList-item-image">
                                <img class="card-img-top" src="${item.img}" alt="Card image">
                                <div class="card-overlay">
                                    <p>${item.desc}</p>
                                </div>
                                <button id="addToCartBtn_${item.id}" class="btnStyle-3" onclick="addAction(${item.id})"><i class="fas fa-plus"></i></button>
                            </div>
                            <div class="card-body">
                                <h6>${item.type}</h6>
                                <h4>${item.name}</h4>
                                <p>$${item.price}</p>
                            </div>
                        </div>
                    </div>
                </div>          
        `
            }
        }
        else if (filterValue === "samsung") {
            if (item.type.toLowerCase() === "samsung") {
                content += `  
                <div class="col-sm-6 col-lg-3 mb-4 animate__animated animate__fadeIn wow">
                    <div class="phoneList-item">
                        <div class="card text-center">
                            <div class="phoneList-item-image">
                                <img class="card-img-top" src="${item.img}" alt="Card image">
                                <div class="card-overlay">
                                    <p>${item.desc}</p>
                                </div>
                                <button id="addToCartBtn_${item.id}" class="btnStyle-3" onclick="addAction(${item.id})"><i class="fas fa-plus"></i></button>
                            </div>
                            <div class="card-body">
                                <h6>${item.type}</h6>
                                <h4>${item.name}</h4>
                                <p>$${item.price}</p>
                            </div>
                        </div>
                    </div>
                </div>          
        `
            }
        }
    });
    phoneListHTML.innerHTML = content;
    //Tải từ Local Storage lên
    getLocalStorage();
    //Cập nhật SL đang chọn mua của 1 món hàng
    renderItemQuantity();
    //Cập nhật graphic cho Cart
    renderCart();
    //Tính tiền đang có trong Cart
    calcTotalPrice();
}

//Lấy data của teachers từ server và render ra màng hình
function getListPhones() {
    services.getListPhonesAPI()
        .then(function (result) {
            let filterValue = document.querySelector("#filter select").value;
            renderList(result.data, filterValue);

            cartArr.forEach(function(item){
                if(findInServerArrById(item.product.id, result.data) === -1){
                    removeCartItem(item.product.id);
                    if(!true){
                        getListPhones();
                    }
                }
            })
        })

        .catch(function (error) {
            console.log(error);
        })
}

getListPhones();

//Xử lý khi nhấn nút Add hoặc nút increase số lượng
function addHandler(id) {
    services.getPhoneAPI(id)
        .then(function (result) {
            if (findInArrById(result.data.id, cartArr) != -1) {
                cartArr[findInArrById(result.data.id, cartArr)].quantity += 1;
            }
            else {
                var cartItem = new CartItem(result.data, 1);
                cartArr.push(cartItem);
            }
            //Cập nhật SL đang chọn mua của 1 món hàng
            renderItemQuantity();
            //Cập nhật graphic cho Cart
            renderCart();
            //Tải xuống Local Storage
            setLocalStorage();
        })

        .catch(function (error) {
            console.log(error);
            alert("Data has been changed, please reload a page!")
        })
}
//Kiểm tra trên data có sự thay đổi gì không trước khi add
function addAction(id){
    addHandler(id);
}
//Xử lý khi nhấn nút decrease số lượng
function minusHandler(id) {
    services.getPhoneAPI(id)
        .then(function (result) {
            if (findInArrById(result.data.id, cartArr) != -1) {
                if (cartArr[findInArrById(result.data.id, cartArr)].quantity > 1) {
                    cartArr[findInArrById(result.data.id, cartArr)].quantity -= 1;
                    //Cập nhật SL đang chọn mua của 1 món hàng
                    renderItemQuantity();
                    //Cập nhật graphic cho Cart
                    renderCart();
                    //Tải xuống Local Storage
                    setLocalStorage();
                }
                //Khi số lượng trừ sẽ bằng 0
                else if (cartArr[findInArrById(result.data.id, cartArr)].quantity === 1) {
                    removeCartItem(result.data.id);
                }
            }
        })

        .catch(function (error) {
            console.log(error);
            alert("Data changed, please reload a page");
        })
}
//Kiểm tra trên data có sự thay đổi gì không trước khi minus
function minusAction(id){
    // services.getListPhonesAPI()
    //     .then(function(result){
    //         let originalLength = cartArr.length;
    //         cartArr.forEach(function(item,index){
    //             if(findInServerArrById(item.product.id, result.data) === -1){
    //                 removeCartItem(item.product.id);
    //                 getListPhones();
    //             }
    //         })
    //         let newLength = cartArr.length;
    //         if (originalLength === newLength){
    //             minusHandler(id);
    //         }
    //     })

    //     .catch(function(error){
    //         console.log(error);
    //     })
    minusHandler(id)
}
//---------------------------------------------------------------------------


//FOR CART-------------------------------------------------------------------
//RENDER CART
function renderCart() {
    let tbody = getMyEle("tableContent");
    let content = "";

    cartArr.forEach(function (item, index) {
        content += `
    <tr>
        <td>${index + 1}</td>
        <td>${item.product.name}</td>
        <td>$${item.product.price}</td>
        <td>
            <button onclick="minusAction(${item.product.id})"><i class="fas fa-angle-left"></i></button>
            <spa>${item.quantity}</spa>
            <button onclick="addAction(${item.product.id})"><i class="fas fa-angle-right"></i></button>
        </td>
        <td>$${item.totalPrice()}</td>
        <td><button class="removeBtn" onclick="removeCartItem(${item.product.id})"><i class="fas fa-trash"></i></button></td>
    </tr>
        `
    })
    tbody.innerHTML = content;
    //Tính tổng tiền đang có trong cart
    calcTotalPrice();
}

//REMOVE CART ITEM FROM CART ARRAY
function removeCartItem(id) {
    let index = findInArrById(id, cartArr);
    if (index != -1) {
        cartArr[index].quantity = 0;
        renderItemQuantity();
        calcTotalPrice();
        cartArr.splice(index, 1);
        setLocalStorage();
        renderCart();
    }
}

//CLEAR CART
function clearCart() {
    while (cartArr.length != 0) {
        removeCartItem(cartArr[0].product.id);
    }
}

//Tính tổng tiền đang có trong Cart và render
function calcTotalPrice() {
    let totalPrice = 0;
    cartArr.forEach(function (item) {
        totalPrice += item.totalPrice();
    });
    getMyEle("totalPrice").innerHTML = totalPrice;
}

//Kiểm tra xem sản phầm còn ở server hay không

//--------------------------------------------------------------------------------


//FOR LOCAL STORAGE---------------------------------------------------------------
// TAI XUONG LOCAL STORAGE---------------------------
function setLocalStorage() {
    localStorage.setItem("cartArray", JSON.stringify(cartArr));
}

//GET DATA TU LOCAL STORAGE---------------------------
function getLocalStorage() {
    let temp = localStorage.getItem("cartArray");
    let cartArrTemp =[];
    if (temp != "" && temp != null) {
        cartArrTemp = JSON.parse(temp);
    }
    cartArr = cartArrTemp.map(function(item){
            var temp2 = new CartItem(item.product, item.quantity);
            return temp2;
    })
}
//--------------------------------------------------------------------------------