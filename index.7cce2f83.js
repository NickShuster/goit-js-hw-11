const e=document.getElementById("search-form"),t=document.querySelector(".gallery"),n=document.querySelector(".load-more"),a=document.querySelector(".error");let o="",i=1,r=0;async function s(){try{const n=await axios.get("https://pixabay.com/api/",{params:{key:"38138051-81d00d61410ef793a2f891f68",q:o,image_type:"photo",orientation:"horizontal",safesearch:!0,page:i,per_page:20}}),{hits:s,totalHits:f}=n.data;if(r=f,1===i&&s.length>0&&(e=`Hooray! We found ${r} images.`,a.textContent=e,a.style.display="block",Notiflix.Notify.success(e),d()),0===s.length&&1===i)return m("Sorry, there are no images matching your search query. Please try again."),void l();!function(e){const n=document.createDocumentFragment();e.forEach((e=>{const{webformatURL:t,tags:a,likes:o,views:i,comments:r,downloads:s}=e,l=document.createElement("div");l.classList.add("photo-card");const d=document.createElement("img");d.src=t,d.alt=a,d.loading="lazy";const u=document.createElement("div");u.classList.add("info");const m=c("Likes",o),f=c("Views",i),y=c("Comments",r),h=c("Downloads",s);u.append(m,f,y,h),l.append(d,u),n.appendChild(l)})),t.appendChild(n)}(s),20*i<r?d():(u(),m("We're sorry, but you've reached the end of search results."),Notiflix.Notify.failure("We're sorry, but you've reached the end of search results."))}catch(e){console.log(e),m("Something went wrong. Please try again later."),notiflix.Notify.failure("Something went wrong. Please try again later.")}var e}function c(e,t){const n=document.createElement("p");return n.classList.add("info-item"),n.innerHTML=`<b>${e}:</b> ${t}`,n}function l(){t.innerHTML=""}function d(){n.classList.remove("hide")}function u(){n.classList.add("hide")}function m(e){a.textContent=e,a.style.display="none",Notiflix.Notify.failure(e)}n.classList.add("hide"),a.style.display="none",e.addEventListener("submit",(async function(e){if(e.preventDefault(),o=e.target.elements.searchQuery.value.trim(),""===o)return;i=1,r=0,l(),u(),await s()})),n.addEventListener("click",(async function(){i++,await s()}));
//# sourceMappingURL=index.7cce2f83.js.map
