// Дэлгэцтэй ажиллах контроллер
var uiController = (function () {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
    incomeList: ".income__list",
    expenseList: ".expenses__list",
  };
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        // parseInt function convert string to int hurwvvlegch function
        value: parseInt(document.querySelector(DOMstrings.inputValue).value),
      };
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
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">$$DESCRIPTION$$</div>          <div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      // Тэр html дотроо орлого зарлагын утгуудыг replace ашиглаж өөрчөлж өгнө
      html = html.replace("%id%", item.id);
      html = html.replace("$$DESCRIPTION$$", item.description);
      html = html.replace("$$VALUE$$", item.value);
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
      data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
    },
    tusviigAvah: function () {
      return {
        tusuv: data.tusuv,
        huvi: data.huvi,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
      };
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
      // 4. төсвийг тооцоолно
      financController.tusuvTootsooloh();

      // 5. эцсийн үлдэгдэл тооцоог дэлгэцэнд гаргана.
      var tusuv = financController.tusviigAvah();

      // 6. Төсвийн тооцоог дэлгэцэнд гаргана.
    }
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
  };

  return {
    init: function () {
      console.log("application started...");
      setupEventlisteners();
    },
  };
})(uiController, financController);

appController.init();
