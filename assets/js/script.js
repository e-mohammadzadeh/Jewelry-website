const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const loginUrl = "http://2.187.249.48:8080/login";
const infoUrl = "http://2.187.249.48:8080/get-last-price-list";
const radio_button1 = document.getElementById("radio-btn1");
const radio_button2 = document.getElementById("radio-btn2");

function updateStockInfo() {
    login().then(token => {
        if (token) {
            getStockInfo(token).then(infoList => {
                displayStockInfo(infoList);
            });
        }
    });
}


function login() {
    return fetch(loginUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: USERNAME, password: PASSWORD})
    })
        .then(response => {
            if (response.ok) {
                return response.json().then(data => data.authorization);
            } else {
                throw new Error('Login failed');
            }
        })
        .catch(error => {
            console.error('Login failed:', error);
            return null;
        });
}


function getStockInfo(token) {
    return fetch(infoUrl, {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('API call failed');
            }
        })
        .catch(error => {
            console.error('API call failed:', error);
            return null;
        });
}


function displayStockInfo(infoList) {
    const upDict = infoList[0].priceGroupName === 'نقدی 24' ? infoList[0] : infoList[1];
    const downDict = infoList[0].priceGroupName === 'نقدی 24' ? infoList[1] : infoList[0];

    const isActive = upDict.activeSell && upDict.activeBuy;
    console.log('is Active: ', isActive);
    let sellPrice = upDict.sell === downDict.sell ? ('' + (upDict.sell / 10)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 'N/A';
    let upBuyPrice = ('' + (upDict.buy / 10)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    let downBuyPrice = ('' + (downDict.buy / 10)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById('old_price').value = upDict.sell / 10;
    document.getElementById('price').value = downDict.buy / 10;

    document.getElementById('sellP').innerHTML = sellPrice;
    document.getElementById('upBuyP').innerHTML = upBuyPrice;
    document.getElementById('downBuyP').innerHTML = downBuyPrice;
}


setInterval(updateStockInfo, 60000);
updateStockInfo();


let inputs = [];

radio_button1.addEventListener("click", myFunction);
radio_button2.addEventListener("click", myFunction);


function myFunction() {
    document.getElementById("weight-type").innerHTML = this.id === "radio-btn1" ? "مثقال" : "گرم";
}


function showTime() {
    let date = new Date();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    let time_format = h + ":" + m + ":" + s
    document.getElementById("time").innerHTML = time_format;
    setTimeout(showTime, 500);
    return time_format;
}


function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}


function showDate() {
    let options = {
        weekday: "long",
        day: "numeric",
        year: "numeric",
        month: "long",
    };
    document.getElementById("date").innerHTML = new Date().toLocaleDateString("fa-IR", options);
}


showTime();
showDate();


function compute_gold_price_with_details(event) {
    event.preventDefault();
    let jewelry_name_ = document.getElementById("jewelry_name").value;
    let weight_ = parseFloat(document.getElementById("gold_weight").value);
    let price_ = parseFloat(document.getElementById("price").value.split(",").join(""));
    let type_ = "گرم";
    if (document.querySelector('input[name="weight-unit"]:checked').value === '1') {
        price_ /= 4.3318;
        type_ = "مثقال";
    }
    let price_show = price_.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    let wages_ = parseFloat(document.getElementById("fixed-wage").value) / 100;
    let profit_ = parseFloat(document.getElementById("profit-percentage").value) / 100;
    let tax_ = parseFloat(document.getElementById("tax-percentage").value) / 100;

    price_ += price_ * wages_;
    price_ += price_ * profit_;
    price_ += price_ * tax_;

    let result_ = (weight_ * price_).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById("result").innerHTML = result_;

    document.getElementById("sub_price").style.display = "block";
    document.getElementById("history").style.display = "block";

    let weight_price = (weight_ * price_).toFixed(2);
    let weight_price_show = weight_price.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById("micro-weight-price").innerHTML = weight_price_show;

    let total_profit = (((parseFloat(weight_price) + wages_) * profit_) / 100).toFixed(2);
    let total_profit_show = total_profit.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById("micro-profit").innerHTML = total_profit_show;

    let total_tax = (((parseFloat(total_profit) + wages_) * tax_) / 100).toFixed(2);
    let total_tax_show = total_tax.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById("micro-tax").innerHTML = total_tax_show;

    if (!inputs.some(obj => obj.jewelry_name === jewelry_name_)) {
        inputs.push({
            hour: showTime(),
            jewelry_name: jewelry_name_,
            gold_weight: weight_,
            weight_type: type_,
            price: price_show,
            fixed_wage: wages_,
            profit_percentage: profit_,
            tax_percentage: tax_,
            total_price: result_,
        });
    }
}

function displayPriceDetails() {
    document.getElementById("price-details").style = "display:block";
}

const priceDetail = document.getElementById("price-details");
const switchBtn = document.getElementById("sub_price");

let x1 = 0;
switchBtn.addEventListener("click", () => {
    if (x1 % 2 === 0) {
        switchBtn.innerText = "عدم نمایش ریزمحاسبات";
        priceDetail.style.display = "block";
    } else {
        switchBtn.innerText = "نمایش ریزمحاسبات";
        priceDetail.style.display = "none";
    }
    x1++;
});

function closeForm() {
    document.getElementById("popup-box").style = "display: none";
    document.getElementById("overlay").style = "display: none";
}


function write_in_history() {
    document.getElementById("popup-box").style = "display: block";
    document.getElementById("overlay").style = "display: block";
    window.scrollTo(0, 0);
    let container = document.getElementById("history-table");
    let tableHtml = "";

    for (let i = 0; i < inputs.length; i++) {
        tableHtml += "<table><thead><tr>";
        tableHtml += "<th>";
        tableHtml += inputs[i].jewelry_name;
        tableHtml += "</th><th>";
        tableHtml += inputs[i].hour;
        tableHtml += "</th></tr></thead>";
        tableHtml += "<tbody><tr><td>";
        tableHtml += "<span>وزن:</span>";
        tableHtml += "<span>";
        tableHtml += inputs[i].gold_weight;
        tableHtml += "</span>";
        tableHtml += "</td><td>";
        tableHtml += "<span>";
        tableHtml += inputs[i].weight_type;
        tableHtml += "</span>";
        tableHtml += "</td></tr><tr><td>";
        tableHtml += "<span>قیمت:</span>";
        tableHtml += "<span>";
        tableHtml += inputs[i].price;
        tableHtml += "</span>";
        tableHtml += "</td><td>";
        tableHtml += "<span>اجرت ثابت:</span>";
        tableHtml += "<span>";
        tableHtml += inputs[i].fixed_wage;
        tableHtml += "</span>";
        tableHtml += "</td></tr><tr><td>";
        tableHtml += "<span>درصد سود:</span>";
        tableHtml += "<span>";
        tableHtml += inputs[i].profit_percentage;
        tableHtml += "</span>";
        tableHtml += "</td><td>";
        tableHtml += "<span>درصد مالیات:</span>";
        tableHtml += "<span>";
        tableHtml += inputs[i].tax_percentage;
        tableHtml += "</span>";
        tableHtml += "</td></tr><tr><td>";
        tableHtml += "<span>قیمت کل:</span>";
        tableHtml += "<span>";
        tableHtml += inputs[i].total_price;
        tableHtml += "</span>";
        tableHtml += "</td>";
        tableHtml += "</tr></tbody></table>";
    }
    container.innerHTML = tableHtml;
}


document.getElementById("price").addEventListener("input", (event) =>
    (event.target.value = (parseInt(event.target.value.replace(/\D+/gi, "")) || 0).toLocaleString("en-US"))
);
document.getElementById("result").addEventListener("b", (event) =>
    (event.target.value = (parseInt(event.target.value.replace(/\D+/gi, "")) || 0).toLocaleString("en-US"))
);


function compute_old_gold_price(event) {
    event.preventDefault();
    let old_gold_weight_ = parseFloat(document.getElementById('old_gold_weight').value);
    let old_gold_price_ = parseFloat(document.getElementById('old_price').value);
    let desired_number_ = parseFloat(document.getElementById('slider').value);
    let price_show = old_gold_price_ / 4.3318;
    let total_price = price_show / 750 * desired_number_ * old_gold_weight_;
    let result_ = total_price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById('result').innerText = result_;

    if (!inputs.some(obj => obj.jewelry_name === old_gold_weight_)) {
        inputs.push({
            hour: showTime(),
            jewelry_name: 'کهنه_' + old_gold_weight_,
            gold_weight: old_gold_weight_,
            weight_type: 'مثقال',
            price: price_show.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            fixed_wage: 0.0,
            profit_percentage: 0.0,
            tax_percentage: 0.0,
            total_price: result_,
        });
    }
}

// Update slider value display
document.getElementById('slider').oninput = function () {
    document.getElementById('sliderValue').innerText = this.value;
}
