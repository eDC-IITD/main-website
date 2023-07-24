// Base URL
const base_url = 'https://www.edciitd.com/';

function showToHtml(data) {
    const blogContent = document.getElementById('blog-content');
    const blogList = data.blog.map(function (blog) {
        return `<div class="blogs">
                        <div class="img">
                            <img src=${blog.photo} alt="blog">
                            <div class="blog-date">${blog.dateOfEvent}</div>
                        </div>
                        <div class="blog-text">
                            <h3>${blog.heading.length>25?blog.heading.slice(0,20)+"...":blog.heading}</h3>
                            <p>
                                ${blog.paragraph[0].length>150?blog.paragraph[0].slice(0,150)+"...":blog.paragraph[0]}
                            </p>
                            <a href="blogDetails.html?${blog.heading}">Read More</a>
                        </div>
                </div>`;
    })
    blogContent.innerHTML = blogList.join(' ');
}

async function getBlogData() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }
    const url = `${base_url}api/blog`;
    try {
        await fetch(url, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data.status == 200) {
                    showToHtml(data);
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