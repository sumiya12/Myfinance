// Дэлгэцтэй ажиллах контроллер
var uiController = (function () {})();

// Санхүүтэй ажиллах крнтроллер
var financController = (function () {})();

// Прогамын холбогч контроллер
var appController = (function (uiController, financController) {
  var ctrlAddItem = function () {
    // 1. оруулах өгөгдлийг дэлгэцээс олж авна.
    console.log("дэлгэцээс өгөгдлөө авах хэсэг");
    // 2. олж авсан өгөгдлүүдээ санхүүгийн контроллерт дамжуулж тэнд хадгална.
    // 3. олж авсан өгөндлүүдээ вэб дээрээ тохирох хэсэгт нь гаргана.
    // 4. төсвийг тооцоолно
    // 5. эцсийн үлдэгдэл тооцоог дэлгэцэнд гаргана.
  };
  document.querySelector(".add__btn").addEventListener("click", function () {
    ctrlAddItem();
  });

  document.addEventListener("keypress", function (event) {
    if (event.keyCode === 13) {
      ctrlAddItem();
    }
  });
})(uiController, financController);
