// Base URL
const base_url = 'https://www.edciitd.com/';

function showToHtml(data) {
    const blogContent = document.getElementById('blog-content');
    blogContent.innerHTML = `<div class="blog-detail">
                                <div class="blog-detail-header">${data.heading}</div>
                                <div class="header-caption"><b>Posted on <span class="color">${data.dateOfEvent}</span><b></div>
                                <div class="blog-detail-image">
                                    <img src="${data.photo}" alt="blog" width="90%" height="100%" class="blog-detail-img"/>
                                </div>
                                <div class="blog-detail-text">
                                    <div class="blog-detail-para">
                                        ${
                                            data.paragraph.map(function (para) {
                                                return `<p class="blog-detail-paragraph">${para}</p>`;
                                            }).join(' ')
                                        }
                                    <div>
                                <div>
                            </div>`;
}

async function getBlogData() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }
    const getQuery = window.location.search
    const blogHeading = getQuery.substring(1);
    const url = `${base_url}api/blog/${blogHeading}`;
    try {
        await fetch(url, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data.status == 200) {
                    showToHtml(data.blog);
                }
                else {
                    console.log(data);
                    swal({
                        title: data.message,
                        icon: "info",
                    });
                }
            })
    }
    catch (error) {
        console.log('Error:' + error);
        swal({
            title: "Some Error occured",
            icon: "error",
        });
    }
}

getBlogData();