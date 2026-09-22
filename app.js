// 1. 구글 시트 CSV 웹 게시 URL (여기에 복사한 URL을 넣으세요)
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3eEeVbLKgTzNpROb5zmnH1xZLrpzcM6lagfldM0pviqL5LZjoQ16x6umb-JA__TvFGQd1euWmPNsF/pub?output=csv';

let allProducts = [];
let currentCategory = '전체';

// 2. 초기화 함수
async function init() {
  try {
    const response = await fetch(CSV_URL);
    const csvText = await response.text();
    
    // PapaParse로 CSV 텍스트를 JSON 배열로 변환
    const parsedData = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    
    // isActive가 TRUE인 데이터만 필터링하고 sortOrder 순으로 정렬
    allProducts = parsedData.data
      .filter(item => item.isActive?.toUpperCase() === 'TRUE')
      .sort((a, b) => parseInt(a.sortOrder) - parseInt(b.sortOrder));

    renderTabs();
    renderProducts();
  } catch (error) {
    console.error('데이터를 불러오는데 실패했습니다:', error);
  }
}

// 3. 카테고리 탭 렌더링 함수
function renderTabs() {
  const tabsContainer = document.getElementById('category-tabs');
  // 중복 없는 카테고리 목록 추출
  const categories = ['전체', ...new Set(allProducts.map(p => p.category))];
  
  tabsContainer.innerHTML = categories.map(category => `
    <button 
      onclick="changeCategory('${category}')"
      class="snap-start shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-200 
      ${currentCategory === category ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}"
    >
      ${category}
    </button>
  `).join('');
}

// 4. 탭 클릭 시 카테고리 변경 함수
window.changeCategory = (category) => {
  currentCategory = category;
  renderTabs(); // 탭 스타일 업데이트
  renderProducts(); // 리스트 업데이트
};

// 5. 상품 리스트 렌더링 함수
function renderProducts() {
  const listContainer = document.getElementById('product-list');
  
  const filteredProducts = currentCategory === '전체' 
    ? allProducts 
    : allProducts.filter(p => p.category === currentCategory);

  listContainer.innerHTML = filteredProducts.map(product => `
    <a href="${product.linkUrl}" target="_blank" rel="noopener noreferrer" 
       class="flex items-center p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow active:scale-95">
      ${product.imageUrl ? `
        <div class="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-50">
          <img src="${product.imageUrl}" alt="${product.title}" class="w-full h-full object-cover">
        </div>
      ` : ''}
      <div class="ml-4 flex-1">
        <h3 class="text-base font-bold text-gray-900">${product.title}</h3>
        <p class="text-sm text-gray-500 mt-1 line-clamp-1">${product.description}</p>
      </div>
      <div class="ml-2 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    </a>
  `).join('');
}

// 앱 실행
init();