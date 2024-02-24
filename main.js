const API_KEY = '7193a00c8b994a8da934dcf151157b84';
let newsList =[];
const menus = document.querySelectorAll(".menus button");
menus.forEach(menu=>menu.addEventListener("click",(event)=>getNewsByCategory(event)));
const keysearch = document.getElementById("KeywordSearch");
keysearch.addEventListener("click", (event) => getNewsSearch(event));
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    getNewsSearch();
  }
});


let url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`);

const getNews = async() => {
  try {
    url.searchParams.set("page",page); // => &page=page
    url.searchParams.set("pageSize",pageSize);
    const response = await fetch(url);
    const data = await response.json();
    if (response.status === 200) {
      if (data.articles.length === 0) {
        throw new Error("No result for this search");
      }
      newsList = data.articles;
      totalResults = data.totalResults;
      render();
      paginationRender();
    } else {
      throw new Error(data.message);
    }
  } catch(error) {
    errorRender(error.message);
  }
};

let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

const paginationRender = () => {
  // totalResult,
  // Page
  // Pagesize
  // groupSize
  // totalPages
  const totalPages = Math.ceil(totalResults / pageSize);
  // pageGroup
  const pageGroup = Math.ceil(page / groupSize);
  // lastPage
  let lastPage = pageGroup * groupSize;
  // 마지막 페이지 그룹이 그룹사이즈보다 작으면 lastpage = totalpage
  if(lastPage > totalPages){
    lastPage = totalPages;
  }

  // firstPage
  const firstPage = lastPage - (groupSize - 1)<=0? 1:lastPage - (groupSize - 1);
  
  let paginationHTML = ``;
    paginationHTML += `<li class="page-item ${page <= 1 ? 'disabled' : ''}" onclick="moveToPage(${page - 5 >= 1 ? page - 1 : 1})"><a class="page-link"><i class="fa-solid fa-angles-left"></i></a></li>`;
    paginationHTML += `<li class="page-item ${page <= 1 ? 'disabled' : ''}" onclick="moveToPage(${page - 1 >= 1 ? page - 1 : 1})"><a class="page-link"><i class="fa-solid fa-angle-left"></i></a></li>`;
  for(let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${i===page?`active`:""}" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`;
  }
  
    paginationHTML += `<li class="page-item ${page === totalPages ? 'disabled' : ''}" onclick="moveToPage(${page + 1})"><a class="page-link"><i class="fa-solid fa-angle-right"></i></a></li>`;
    paginationHTML += `<li class="page-item ${page === totalPages ? 'disabled' : ''}" onclick="moveToPage(${page + 5})"><a class="page-link"><i class="fa-solid fa-angles-right"></i></a></li>`;
    document.querySelector(".pagination").innerHTML = paginationHTML;
};

const moveToPage=(pageNum)=>{
  console.log("moveToPage",pageNum);
  page = pageNum;
  getNews();
};


const errorRender = (errormessage) =>{
  const errorHTML = `<div class="alert alert-danger" role="alert">
  ${errormessage}
</div>`;

  document.getElementById("news-board").innerHTML=errorHTML
};

const getlatestNews = async() => {
  url = new URL(`https://praticenews.netlify.app/top-headlines?country=kr&apiKey=${API_KEY}`); //누나 API
  //url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`);
  getNews();
};

const sideMenuButtons = document.querySelectorAll('.side-menu-list button');

sideMenuButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const category = event.target.textContent.toLowerCase();
        url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`);
        getNews();
    });
});


const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  url = new URL(`https://praticenews.netlify.app/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`); //누나 API
  //url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`)
  getNews();
};

const getNewsSearch = async () =>{
  const searchInput = document.getElementById('search-input');
  const keyword = searchInput.value.trim();
  url = new URL(`https://praticenews.netlify.app/top-headlines?country=kr&q=${keyword}&apiKey=${API_KEY}`); //누나 API
  //url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&q=${keyword}&apiKey=${API_KEY}`)
  const response = await fetch(url);
  const data = await response.json();
  const uniqueNews = remove(data.articles);
  newsList = uniqueNews;
  getNews();
  searchInput.value = '';
  };


const remove = (news) => {
  return news.filter((article, index, array) => 
    array.findIndex(a => a.url === article.url) === index
  );
};

let newsHTML ='';

  const render=()=>{
    const noImageurl = 'https://t3.ftcdn.net/jpg/04/34/72/82/360_F_434728286_OWQQvAFoXZLdGHlObozsolNeuSxhpr84.jpg';
    newsHTML = newsList.map(news=> {
        let description = news.description;
        let imageUrl = news.urlToImage ? news.urlToImage : noImageurl ;
        let sourceName = news.source.name ? news.source.name : 'No Source';
        let rights = news.rights || "No Source"; 
        let publishedDate = moment(news.published_date).fromNow();
        if (!description) {
            return `<div class="row news">
                <div class="col-lg-4">
                    <img class="news-img-size" src="${imageUrl}" alt="No Image">
                </div>
                <div class="col-lg-8">
                    <h2>${news.title}</h2>
                    <p>
                        내용없음
                    </p>
                    <div>
                    ${sourceName} * ${publishedDate}
                    </div>
                </div>
            </div>`;
        } else if (description.length > 200) {
            description = description.substring(0, 200) + '...';
        }
        return `<div class="row news">
            <div class="col-lg-4">
                <img class="news-img-size" src="${imageUrl}" alt="No Image">
            </div>
            <div class="col-lg-8">
                <h2>${news.title}</h2>
                <p>
                    ${description}
                </p>
                <div>
                ${sourceName} * ${publishedDate}
                </div>
            </div>
        </div>`;
    }).join("");

    document.getElementById("news-board").innerHTML = newsHTML;
  };

  getlatestNews();

  function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

  const openSearchBox = () => {
    // let inputArea = document.getElementById("input-area");
    // if (inputArea.style.display === "inline") {
      // inputArea.style.display = "none";
    // } else {
      // inputArea.style.display = "inline";
    // }
    getNewsSearch();
  };

  function topFunction() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function bottomFunction(){
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth"
    });
  }
  
