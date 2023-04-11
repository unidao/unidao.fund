var images = ["events-01.jpg", "events-02.jpg", "events-03.jpg"]; // массив изображений
var currentImageIndex = 0; // индекс текущего изображения

function changeImage() {
  // получаем элемент с изображением
  var imageElement = document.getElementById("slideshow-image");

  // меняем изображение на следующее в массиве
  currentImageIndex++;
  if (currentImageIndex >= images.length) {
    currentImageIndex = 0;
  }
  imageElement.src = images[currentImageIndex];

  // через 5 секунд вызываем функцию снова
  setTimeout(changeImage, 1000);
}

// вызываем функцию для первоначальной установки изображения и запуска переключения
changeImage();
