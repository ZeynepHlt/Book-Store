toastr.options = {
  closeButton: false,
  debug: false,
  newestOnTop: false,
  progressBar: false,
  positionClass: "toast-bottom-right",
  preventDuplicates: false,
  onclick: null,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "5000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};
//!Slider
let imgDOM = document.querySelector(".slide-img");
let imageArr = [
  "../images/slide1.png",
  "../images/slide2.png",
  "../images/slide3.png",
];
let index = 0;
let duration = 2000;
let control = 0;
function slideImg() {
  if (control == 0) {
    imgDOM.src = imageArr[index];
    if (index < imageArr.length - 1) {
      index++;
    } else {
      index = 0;
    }
  } else {
    imgDOM.src = imageArr[index];
  }

  setTimeout(() => {
    slideImg();
  }, duration);
}

//!Basket Modal
const toggleModal = () => {
  let basketModalEl = document.querySelector(".basket_modal");
  let basketContent = document.querySelector(".basket_content");
  basketModalEl.classList.toggle("activeModal");
  if (basketModalEl.classList.contains("activeModal")) {
    basketContent.classList.add("block");
  }
  console.log("tıklandı");
};

//!Get Books-Kitapları getirme
let bookList = [];
let basketList = [];
async function getBooks() {
  const response = await fetch("./products.json");
  const books = await response.json();
  bookList = books;
  console.log(bookList);
}
getBooks();

const createBookStars = (starRate) => {
  starRateHtml = "";
  for (let i = 1; i <= 5; i++) {
    if (Math.round(starRate) >= i) {
      starRateHtml += `<i class="fa-solid fa-star text-sm text-yellow-400 "></i>`;
    } else {
      starRateHtml += `<i class="fa-regular fa-star text-sm text-gray-600"></i>`;
    }
  }
  return starRateHtml;
};

//!Kitapları html de oluşturma
const createBookItemsHtml = () => {
  let bookListEl = document.querySelector(".book_list");
  let bookListHtml = ""; //yeni olulturulacak liste elemanı
  bookList.forEach((book) => {
    bookListHtml += `
  <div class="flex  basis-1/2 mb-10 px-4 h-auto">
    <div class="basis-1/2">
      <img class="w-48 h-80 shadow-lg shadow-slate-700" src="${
        book.imgSource
      }" alt="nutuk">
    </div>
    <div class=" flex  flex-col justify-between basis-1/2 ">
      <div class="mb-4">
        <span class="book_author text-gray-600 text-sm font-Open mb-1">${
          book.author
        }</span><br>
        <span class="book_name font-bold font-Mont text-lg ">${
          book.name
        }</span><br>
        <span class="book_star_rate">
         ${createBookStars(book.starRate)}
        </span>
        <span class="book_reviews text-sm text-gray-600"> ${
          book.reviewCount
        } reviews</span>
      </div>
      <p class="font-Mont text-sm text-clip line-clamp-4 mb-4">${
        book.description
      }</p>
      <div class="">
        <span class="font-bold font-Mont text-lg">${
          book.price
        } &#8378; &nbsp; </span>
        
         ${
           book.oldPrice
             ? `<span class="line-through font-bold font-Mont text-lg text-gray-600">
         ${book.oldPrice} &#8378; </span>`
             : ""
         } 
      </div>
      <button class="buttons" onclick="addBookToBasket(${
        book.id
      })">Sepete Ekle</button>
   
    </div>
  </div>
  
  `;
  });
  bookListEl.innerHTML = bookListHtml;
};

//!Kitap tiplerinini filtreleme
//html e tiplerin linklerini listeleme
//object literal
const BOOK_TYPES = {
  ALL: "Tümü",
  NOVEL: "Roman",
  HISTORY: "Tarih",
  FINANCE: "Finans",
  CHILDREN: "Çocuk",
  SELFIMPROVEMENT: "Kişisel Gelişim",
  SCIENCE: "Bilim",
};

const createBookTypeHtml = () => {
  const filterEl = document.querySelector(".book_filter");
  let filterHtml = "";
  let filterTypes = ["ALL"];
  //booklist(her bir kitabı içeren liste) içerisinde dön ve o tip varsa o şekilde ekle eğer yoksa ekleme
  bookList.forEach((book) => {
    if (filterTypes.findIndex((filter) => filter == book.type) == -1) {
      filterTypes.push(book.type);
    }
  });

  filterTypes.forEach((type, index) => {
    filterHtml += ` <li onclick="filterBooks(this)" data-type="${type}" class="py-3 ${
      index == 0 ? "active relative" : null
    } ">${BOOK_TYPES[type] || type}
    </li>`;
  });

  filterEl.innerHTML = filterHtml;
};

const filterBooks = (filterEl) => {
  document.querySelector(".book_filter .active").classList.remove("active");
  filterEl.classList.add("active");
  filterEl.classList.add("relative");
  getBooks(); //yeniden listedeki tüm kitapları ekle
  let bookType = filterEl.dataset.type;
  if (bookType != "ALL") {
    bookList = bookList.filter((book) => book.type == bookType); //seçilen listedeki type ile book list içerisindeki type eşleşenleri tekrar bookliste
  }

  createBookItemsHtml(); //güncelle
};

setTimeout(() => {
  createBookItemsHtml();
  createBookTypeHtml();
}, 100);

//!Sepete Kitap ekleme
//html de gösterme
const listBasketItem = () => {
  localStorage.setItem("basketList", JSON.stringify(basketList)); //localde kaydet
  let basketListEl = document.querySelector(".basket_list");
  let basketCount = document.querySelector(".basket_count");
  let basket_content_count = document.querySelector(".basket_product_count");
  let totalPriceEl = document.querySelector(".total_price");
  let basketListHtml = "";
  let totalPrice = 0;

  basketList.forEach((item) => {
    totalPrice += item.product.price * item.quantity;
    basketListHtml += ` <li class="basket_item flex justify-between space-x-4 items-center px-5 pb-2">
    <img class="object-fill w-16 h-20" src="${item.product.imgSource}" alt="">
    <div class="px-2 w-48">
      <span class="book_name font-bold font-Mont text-xs">${item.product.name}</span><br>
      <span class="font-bold font-Mont text-xs">${item.product.price} &#8378; &nbsp; </span>
      <div>
      <button class="px-4 text-red-600 border border-red-600 font-bold font-Open text-xs rounded-xl" onclick="removeItemToBasket(${item.product.id})"> Sil</button>
      </div>
     
    </div>
    <div class="flex font-Mont font-bold space-x-3 px-3">
      <button onclick="decreaseItemToBasket(${item.product.id})"><i class="fa-solid fa-minus"></i></button>
      <p>${item.quantity}</p>
      <button onclick="increaseItemToBasket(${item.product.id})" ><i class="fa-solid fa-plus"></i></button>
    </div>
 
    </li> `;
  });
  basketCount.innerHTML = basketList.length > 0 ? basketList.length : null;
  basket_content_count.innerHTML = `Sepetim(${
    basketList.length > 0 ? basketList.length : 0
  })`;
  basketListEl.innerHTML = basketListHtml
    ? basketListHtml
    : `<li class="basket_item space-x-4 text-center px-5 pb-2">
  Herhangi bir ürün bulunamadı...
  </li>`;

  totalPriceEl.innerHTML = `Toplam Tutar : ${
    totalPrice > 0 ? totalPrice.toPrecision(4) : "0"
  } ₺ `;
};

//localStorage
if (localStorage.getItem("basketList")) {
  basketList = JSON.parse(localStorage.getItem("basketList"));
  listBasketItem();
}
//listeye ekleme

const addBookToBasket = (bookId) => {
  let findedBook = bookList.find((book) => book.id == bookId); //eklenen kitabı bul
  if (findedBook) {
    //eğer bulduysan
    const basketAlredyIndex = basketList.findIndex(
      (basket) => basket.product.id == bookId
    );
    if (basketAlredyIndex == -1) {
      let addItem = { quantity: 1, product: findedBook };
      basketList.push(addItem);
    } else {
      if (
        basketList[basketAlredyIndex].quantity <
        basketList[basketAlredyIndex].product.stock
      )
        basketList[basketAlredyIndex].quantity += 1;
      else {
        toastr.error("Malesef..Stokta yok..");
        return;
      }
    }
    listBasketItem();
    toastr.success("Sepete Eklendi...");
  }
  console.log(basketList);
};
//listeden silme
const removeItemToBasket = (removeId) => {
  // if (findedBasket != -1) {
  basketList = basketList.filter((basket) => basket.product.id != removeId);
  // }
  listBasketItem();
  toastr.warning("Ürün Silindi...");

  console.log(basketList);
};

//Sepetteki kitabı artırıp azaltma
//artırma
const decreaseItemToBasket = (bookId) => {
  const findedIndex = basketList.findIndex(
    (basket) => basket.product.id == bookId
  );
  if (findedIndex != -1) {
    if (basketList[findedIndex].quantity != 1) {
      basketList[findedIndex].quantity -= 1;
    } else removeItemToBasket(bookId);
  }
  listBasketItem();
};
//azaltma
const increaseItemToBasket = (bookId) => {
  const findedIndex = basketList.findIndex(
    (basket) => basket.product.id == bookId
  );
  if (findedIndex != -1) {
    if (
      basketList[findedIndex].quantity < basketList[findedIndex].product.stock
    ) {
      basketList[findedIndex].quantity += 1;
    } else {
      toastr.error("Malesef..Stokta yok..");
      return;
    }
  }
  listBasketItem();
};

window.addEventListener("DOMContentLoaded", () => {
  slideImg();
  imgDOM.addEventListener("mouseover", () => {
    // console.log(index, "üzerinde");
    control = 1;
  });
  imgDOM.addEventListener("mouseout", () => {
    // console.log("üzerinde değil");
    control = 0;
  });
});
