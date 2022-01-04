// Дэлгэцтэй ажиллах контроллер
var uiController = (function () {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
    incomeList: ".income__list",
    expenseList: ".expenses__list",
    tusuvLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    contoinerDiv: ".container",
    expensePercentageLabel: ".item__percentage",
    dateLabel: ".budget__title--month",
  };

  var nodeListForeach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };
  var formatMoney = function (too, type) {
    too = "" + too;
    var x = too.split("").reverse().join("");
    var y = "";
    var count = 1;
    for (var i = 0; i < x.length; i++) {
      y = y + x[i];
      if (count % 3 === 0) y = y + ",";
      count++;
    }
    var z = y.split("").reverse().join("");
    if (z[0] === ",") z = z.substr(1, z.length - 1);
    if (type === "inc") z = "+" + z;
    else z = "-" + z;
    return z;
  };

  return {
    displayDate: function () {
      var unuudur = new Date();
      document.querySelector(DOMstrings.dateLabel).textContent =
        unuudur.getFullYear() + " оны " + unuudur.getMonth() + " сарын ";
      // console.log(unuudur.getMonth());
    },
    changeType: function () {
      var fields = document.querySelectorAll(
        DOMstrings.inputType +
          "," +
          DOMstrings.inputDescription +
          "," +
          DOMstrings.inputValue
      );
      nodeListForeach(fields, function (el) {
        el.classList.toggle("red-focus");
      });
      document.querySelector(DOMstrings.addBtn).classList.toggle("red");
    },
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        // parseInt function convert string to int hurwvvlegch function
        value: parseInt(document.querySelector(DOMstrings.inputValue).value),
      };
    },
    displayPercentages: function (allPercentages) {
      // Зарлагын ноде ийг олох
      var elements = document.querySelectorAll(
        DOMstrings.expensePercentageLabel
      );
      // элемент болгоны хувьд  зарлагын хувийг массиваас авч шивж оруулах
      nodeListForeach(elements, function (el, index) {
        el.textContent = allPercentages[index];
      });
    },
    getDOMstrings: function () {
      return DOMstrings;
    },
    // field dotor clear hiih 2 input iig dom oos select hiij bn
    clearFields: function () {
      var fields = document.querySelectorAll(
        DOMstrings.inputDescription + ", " + DOMstrings.inputValue
      );

      // convert list to array
      var fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function (el, index, array) {
        el.value = "";
      });
      // focus iig massive iin 0 dugaar elementruu shiljvvlj bgaa uildel focus gedeg bol cursoriig zaaj bgaa heseg
      fieldsArr[0].focus();
      // for (var i = 0; i < fieldsArr.length; i++) {
      //   fieldsArr[i].value = "";
      // }
    },

    tusviigUzuuleh: function (tusuv) {
      var type;
      if (tusuv.tusuv > 0) type = "inc";
      else type = "exp";
      document.querySelector(DOMstrings.tusuvLabel).textContent = formatMoney(
        tusuv.tusuv,
        type
      );
      document.querySelector(DOMstrings.incomeLabel).textContent = formatMoney(
        tusuv.totalInc,
        "inc"
      );
      document.querySelector(DOMstrings.expenseLabel).textContent = formatMoney(
        tusuv.totalExp,
        "exp"
      );
      if (tusuv.huvi !== 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          tusuv.huvi + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          tusuv.huvi;
      }
    },
    // Оруулсан өгөгдөлөө устгаж байна parentaas remove child aar ustgaj bn
    deleteListItem: function (id) {
      var el = document.getElementById(id);
      el.parentNode.removeChild(el);
    },

    addListItem: function (item, type) {
      // орлого зарлагын элементийг агуулсан html  ийг бэлтгэнэ.
      var html, list;
      if (type === "inc") {
        list = DOMstrings.incomeList;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else {
        list = DOMstrings.expenseList;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      // Тэр html дотроо орлого зарлагын утгуудыг replace ашиглаж өөрчөлж өгнө
      html = html.replace("%id%", item.id);
      html = html.replace("$$DESCRIPTION$$", item.description);
      html = html.replace("$$VALUE$$", formatMoney(item.value, type));
      // Бэлтгэсэн html ээ DOM руу хийж өгнө.
      document.querySelector(list).insertAdjacentHTML("beforeend", html);
    },
  };
})();

// Санхүүтэй ажиллах кoнтроллер
var financController = (function () {
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };
  Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0)
      this.percentage = Math.round((this.value / totalIncome) * 100);
    else this.percentage = 0;
  };
  Expense.prototype.getPercentage = function () {
    return this.percentage;
  };
  var calculateTotal = function (type) {
    var sum = 0;
    data.Items[type].forEach(function (el) {
      sum = sum + el.value;
    });
    data.totals[type] = sum;
  };
  var data = {
    Items: {
      inc: [],
      exp: [],
    },
    totals: {
      inc: 0,
      exp: 0,
    },
    tusuv: 0,
    huvi: 0,
  };
  return {
    tusuvTootsooloh: function () {
      // нийт орлогын нийлбэрийг тооцоолно
      calculateTotal("inc");
      // нийт зарлагын нийлбэрийг тооцоолно
      calculateTotal("exp");
      // Төсвийг шинээр тооцоолно
      data.tusuv = data.totals.inc - data.totals.exp;
      // Орлого зарлагын хувийг тооцоолно
      if (data.totals.inc > 0)
        data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
      else data.huvi = 0;
    },
    calcPercentage: function () {
      data.Items.exp.forEach(function (el) {
        el.calcPercentage(data.totals.inc);
      });
    },
    getPercentage: function () {
      var allPercentages = data.Items.exp.map(function (el) {
        return el.getPercentage();
      });
      return allPercentages;
    },
    tusviigAvah: function () {
      return {
        tusuv: data.tusuv,
        huvi: data.huvi,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
      };
    },

    deleteItem: function (type, id) {
      var ids = data.Items[type].map(function (el) {
        return el.id;
      });
      // console.log("ids" + ids);
      var index = ids.indexOf(id);
      // console.log("index" + index);

      if (index !== -1) {
        // console.log("ustgah gj bn ");
        data.Items[type].splice(index, 1);
      }
    },
    addItem: function (type, desc, val) {
      var item, id;
      if (data.Items[type].length === 0) {
        id = 1;
      } else {
        id = data.Items[type][data.Items[type].length - 1].id + 1;
      }
      if (type === "inc") {
        item = new Income(id, desc, val);
      } else {
        item = new Expense(id, desc, val);
      }
      data.Items[type].push(item);
      return item;
    },
    seedata: function () {
      return data;
    },
  };
})();

// Прогамын холбогч контроллер
var appController = (function (uiController, financController) {
  var ctrlAddItem = function () {
    // 1. оруулах өгөгдлийг дэлгэцээс олж авна.
    var input = uiController.getInput();
    if (input.description !== "" && input.value !== "") {
      // 2. олж авсан өгөгдлүүдээ санхүүгийн контроллерт дамжуулж тэнд хадгална.
      var item = financController.addItem(
        input.type,
        input.description,
        input.value
      );
      // 3. олж авсан өгөндлүүдээ вэб дээрээ тохирох хэсэгт нь гаргана.
      uiController.addListItem(item, input.type);
      uiController.clearFields();
      //Төсөвийг шинээр тооцоолоод дэлгэцэнд үзүүлэнэ.
      updateTusuv();
    }
  };
  var updateTusuv = function () {
    // 4. төсвийг тооцоолно
    financController.tusuvTootsooloh();

    // 5. эцсийн үлдэгдэл тооцоог дэлгэцэнд гаргана.
    var tusuv = financController.tusviigAvah();
    // 6. Төсвийн тооцоог дэлгэцэнд гаргана.
    uiController.tusviigUzuuleh(tusuv);
    // 7. хувийг тооцоолно
    financController.calcPercentage();
    // 8. элемэнтүүдийн хувийг тооцоолно
    var allPercentages = financController.getPercentage();
    // 9.Эдгээр хувийг дэлгэцэнд гаргана.
    uiController.displayPercentages(allPercentages);
  };
  var setupEventlisteners = function () {
    var DOM = uiController.getDOMstrings();

    document.querySelector(DOM.addBtn).addEventListener("click", function () {
      ctrlAddItem();
    });

    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
    document
      .querySelector(DOM.inputType)
      .addEventListener("change", uiController.changeType);
    document
      .querySelector(DOM.contoinerDiv)
      .addEventListener("click", function (event) {
        var id = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (id) {
          var arr = id.split("-");
          var type = arr[0];
          var itemId = parseInt(arr[1]);
          // console.log(type + "===>" + itemId);
          // 1. санхүүгийн модулиас type , id ашиглаад устгана
          financController.deleteItem(type, itemId);
          // 2. Дэлгэц дээрээс энэ элементийг устгана
          uiController.deleteListItem(id);
          // 3. үлдэгдэл тооцоог шинэчилж харуулна
          updateTusuv();
        }
      });
  };

  return {
    init: function () {
      console.log("application started...");
      uiController.displayDate();
      uiController.tusviigUzuuleh({
        tusuv: 0,
        huvi: 0,
        totalInc: 0,
        totalExp: 0,
      });

      setupEventlisteners();
    },
  };
})(uiController, financController);

appController.init();
