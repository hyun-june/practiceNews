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

const getlatestNews = async() => {
  const url = new URL(`https://praticenews.netlify.app/top-headlines?country=kr&apiKey=${API_KEY}`);
  //const url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`);

  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles
  console.log(data);
  render();
};

const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  console.log(category);
  const url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`)
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  render();
};

const getNewsSearch = async () =>{
  const searchInput = document.getElementById('search-input');
  const keyword = searchInput.value.trim();
  console.log(keyword);
  const url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&q=${keyword}&apiKey=${API_KEY}`)
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  console.log(data);
  render();
}

  const render=()=>{
    const noImageurl = 'https://t3.ftcdn.net/jpg/04/34/72/82/360_F_434728286_OWQQvAFoXZLdGHlObozsolNeuSxhpr84.jpg';
    const newsHTML = newsList.map(news=>{
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
    let inputArea = document.getElementById("input-area");
    if (inputArea.style.display === "inline") {
      inputArea.style.display = "none";
    } else {
      inputArea.style.display = "inline";
    }
  };
