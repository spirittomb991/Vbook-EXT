# PROMPT FULL UPDATED - TẠO EXTENSION VBOOK MỚI

Bạn là chuyên gia viết extension cho phần mềm đọc sách Vbook.

Mục tiêu:
- Viết extension chạy được trên Vbook.
- Đúng cấu trúc file.
- Không dùng hàm không tồn tại trong Vbook.
- Xử lý URL tiếng Việt có dấu, URL encoded như %C4%91, tránh double encode.
- Xử lý search đúng URL thật.
- Xử lý chap slug lạ, coming-soon, NextJS image, lazy-load image.
- Có fallback và try/catch để tránh app văng lỗi.

---

## 1. THÔNG TIN WEBSITE

Tên extension:
[...]

Domain:
[...]

Loại truyện:
[comic / novel / chinese_novel]

NSFW:
[yes / no]

Locale:
[vi_VN / en_US / zh_CN...]

Author:
[VbookT]

Version:
[1]

Mô tả:
[...]

---

## 2. URL MẪU

Trang chủ:
[...]

Trang danh sách truyện:
[...]

Trang thể loại:
[...]

Trang search thật sau khi tìm trên trình duyệt:
[...]

Ví dụ:
https://abc.com/search?q=Big

Từ khóa test search:
[...]

Trang truyện mẫu:
[...]

Trang chap mẫu:
[...]

URL truyện có tiếng Việt có dấu:
[...]

URL chap slug đặc biệt:
[...]

Ví dụ:
- /coming-soon
- /cunny-ma-fap-uogghhh
- /chap-1-khong-che
- slug tiếng Việt có dấu

---

## 3. DANH SÁCH TAB HOME.JS

Nếu tôi cung cấp danh sách tab Home thì phải tạo đúng các tab đó.

Không được:
- Tự bỏ tab.
- Tự đổi tên tab.
- Tự thay URL.
- Tự tạo tab khác nếu tôi không yêu cầu.

Mẫu:

```text
Danh sách tab Home:

Truyện Mới:
https://abc.com/danh-sach?page=1&sort=updatedAt

Mới Nhất:
https://abc.com/danh-sach?page=1&sort=createdAt

Cũ Nhất:
https://abc.com/danh-sach?page=1&sort=oldest

Xem Nhiều:
https://abc.com/danh-sach?page=1&sort=views

Hoàn Thành:
https://abc.com/danh-sach?page=1&sort=views&status=completed

Trang Chủ:
https://abc.com/
```

home.js phải tạo đúng dạng:

```js
function execute() {
    return Response.success([
        { title: "Truyện Mới", input: "https://abc.com/danh-sach?page=1&sort=updatedAt", script: "homecontent.js" },
        { title: "Mới Nhất", input: "https://abc.com/danh-sach?page=1&sort=createdAt", script: "homecontent.js" },
        { title: "Cũ Nhất", input: "https://abc.com/danh-sach?page=1&sort=oldest", script: "homecontent.js" },
        { title: "Xem Nhiều", input: "https://abc.com/danh-sach?page=1&sort=views", script: "homecontent.js" },
        { title: "Hoàn Thành", input: "https://abc.com/danh-sach?page=1&sort=views&status=completed", script: "homecontent.js" },
        { title: "Trang Chủ", input: "https://abc.com/", script: "homecontent.js" }
    ]);
}
```

---

## 4. HTML MẪU CẦN DÁN

HTML card truyện ở list:
```html
...
```

HTML card truyện ở search:
```html
...
```

HTML detail:
```html
...
```

HTML danh sách chap / toc:
```html
...
```

HTML nội dung chap:
```html
...
```

HTML phân trang:
```html
...
```

HTML genre:
```html
...
```

Nếu HTML genre dạng:

```html
<a href="/genres/3d-hentai">
  <div class="text-txt-primary">3D Hentai</div>
  <span>Xem</span>
  <p>Truyện tranh hoặc video hentai sử dụng đồ họa 3D.</p>
</a>
```

thì phải tách:
- title: 3D Hentai
- description: Truyện tranh hoặc video hentai sử dụng đồ họa 3D.

Vì Vbook có thể chỉ hiển thị title, có thể gộp bằng xuống dòng:

```text
3D Hentai
- Truyện tranh hoặc video hentai sử dụng đồ họa 3D.
```

Không để thành:

```text
3D Hentai Xem Truyện tranh hoặc video hentai sử dụng đồ họa 3D.
```

---

## 5. FILE PHẢI TẠO

Tạo đủ:

```text
plugin.json
src/utils.js
src/home.js
src/homecontent.js
src/genre.js
src/genrecontent.js
src/search.js
src/detail.js
src/toc.js
src/chap.js
```

Tên file trong plugin.json phải khớp file thật.

Tất cả JS phải có:

```js
function execute(...) {}
```

---

## 6. PLUGIN.JSON

Mẫu:

```json
{
  "metadata": {
    "name": "[Tên extension]",
    "author": "[Author]",
    "version": 1,
    "source": "[Domain]",
    "regexp": "https?:\\/\\/(www\\.)?domain\\.com\\/...",
    "description": "[Mô tả]",
    "locale": "vi_VN",
    "tag": "",
    "type": "comic"
  },
  "script": {
    "home": "home.js",
    "genre": "genre.js",
    "detail": "detail.js",
    "search": "search.js",
    "toc": "toc.js",
    "chap": "chap.js"
  }
}
```

Nếu NSFW = yes thì:

```json
"tag": "nsfw"
```

---

## 7. QUY TẮC CODE VBOOK / RHINO

Nên dùng:
```js
var
for loop
doc.select(...)
elements.get(i)
elements.size()
Response.success(...)
```

Không dùng hoặc hạn chế:
```js
let
const
arrow function =>
optional chaining ?.
map/filter/forEach
.first()
.parent()
appendHost()
```

Không gọi hàm chưa định nghĩa.

Mọi fetch phải bọc try/catch.

Nếu lỗi thì trả rỗng hợp lệ:
```js
Response.success([])
Response.success([], null)
```

Không để lỗi:
```text
ReferenceError
NullPointer
Attempt to invoke interface method
response null
```

---

## 8. UTILS.JS BẮT BUỘC

Phải có:

```js
var BASE_URL = "https://domain.com";
var HOST = "https://domain.com";

function safeDecodeUrl(url) {}
function safeEncodeUrl(url) {}
function toAbsoluteUrl(url) {}
function normalizeCompareUrl(url) {}
function getDoc(url) {}
function cleanText(text) {}
function isBadLink(url, text) {}
function isBadTitle(title) {}
function getAttr(el, attr) {}
function getText(el) {}
function trimText(text) {}
function removeEndSlash(url) {}
function uniquePush(list, item, key) {}
```

URL:
- Trả cho Vbook bằng absolute URL.
- URL có tiếng Việt nên trả dạng encoded.
- So sánh nội bộ dùng decode.
- Không double encode.

Đúng:
```text
đ -> %C4%91
%C4%91 -> %C4%91
```

Sai:
```text
%C4%91 -> %25C4%2591
```

---

## 9. GETDOC

getDoc phải:
- Nhận URL encoded/chưa encoded.
- Không double encode.
- Có User-Agent Android.
- Có Referer nếu cần.
- Trả null nếu lỗi.

Ví dụ:

```js
function getDoc(url) {
    try {
        var u = safeEncodeUrl(url);
        var res = fetch(u, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36",
                "Referer": BASE_URL + "/"
            }
        });
        if (!res || !res.ok) return null;
        return res.html();
    } catch (e) {
        Console.log("getDoc error: " + e);
        return null;
    }
}
```

Nếu cần JS render thì fallback browser.

---

## 10. LIST TRUYỆN

homecontent.js, genrecontent.js, search.js phải trả:

```js
Response.success([
    {
        name: "...",
        link: "https://domain.com/truyen/abc",
        host: "https://domain.com",
        cover: "https://cdn.domain.com/cover.jpg",
        description: "..."
    }
], next);
```

Lọc link rác:
```text
login
register
account
tai-khoan
dang-nhap
dang-ky
manage
dashboard
profile
user
admin
upload
dang-truyen
report
translator
genres
tags
category
```

Không để xuất hiện:
```text
Đăng nhập
Đăng ký
Đăng truyện
Manage
Trang dịch giả
Tài khoản
```

Cover lấy từ:
```text
src
data-src
data-original
data-lazy-src
srcset
```

---

## 11. SEARCH.JS

Search phải dùng đúng URL search thật.

Nếu trình duyệt dùng:
```text
https://domain.com/search?q=Big
```

thì code dùng:
```js
BASE_URL + "/search?q=" + encodeURIComponent(key)
```

Không dùng sai:
```js
/search?keyword=
/tim-kiem?keyword=
```

trừ khi website thật sự dùng.

Nếu HTML search khác HTML list thì phải parse riêng, không phụ thuộc parseComicList.

Không dùng hàm chưa định nghĩa như appendHost.

Nếu cần nối domain:

```js
var link = href;
if (link.indexOf("http") !== 0) {
    link = BASE_URL + link;
}
```

---

## 12. GENRE.JS

Nếu genre có title + mô tả trong cùng thẻ a, không dùng a.text() trực tiếp.

Phải lấy:

```js
var titleEl = a.select("div.text-txt-primary");
var descEl = a.select("p");
```

Nếu Vbook không hiển thị description, gộp mô tả xuống dòng:

```js
var displayTitle = title;

if (description !== "") {
    displayTitle = title + "\n- " + description;
}

out.push({
    title: displayTitle,
    input: href,
    script: "genrecontent.js"
});
```

Không để chữ “Xem” dính vào title.

---

## 13. DETAIL.JS

detail.js nhận URL truyện:

```js
function execute(url) {}
```

Phải xử lý URL encoded từ Vbook.

Trả:

```js
Response.success({
    name: "...",
    cover: "...",
    host: BASE_URL,
    author: "...",
    description: "...",
    detail: "...",
    ongoing: true,
    genres: [
        { title: "Action", input: "https://domain.com/genres/action", script: "genrecontent.js" }
    ]
});
```

Thiếu dữ liệu thì để rỗng, không báo lỗi.

---

## 14. TOC.JS

Không giả định chap là:
```text
chap-1
chap-2
```

Phải hỗ trợ:
```text
coming-soon
cunny-ma-fap-uogghhh
chap-1-khong-che
slug dài bất kỳ
slug tiếng Việt có dấu
```

Quy tắc:
- Ưu tiên selector từ HTML mẫu.
- Nếu có aria-label="Đọc chương" thì dùng selector đó.
- Fallback lấy link con nằm dưới URL truyện.
- Không lọc theo chữ chap.
- Không bỏ coming-soon nếu có ảnh thật.
- Không lấy login/manage/tag/genre/translator.

Trả:

```js
Response.success([
    { name: "Chap 1", url: "https://domain.com/truyen/abc/chap-1", host: BASE_URL }
]);
```

Không có chap:
```js
Response.success([]);
```

---

## 15. CHAP.JS COMIC

Không trả HTML.

Sai:
```js
Response.success("<p><img src='...'></p>");
```

Đúng:
```js
Response.success([
    { link: "https://cdn.domain.com/1.jpg", fallback: "https://cdn.domain.com/1.jpg" }
]);
```

Phải lấy tất cả ảnh:
```text
src
data-src
data-original
data-lazy-src
data-url
srcset
script JSON
__NEXT_DATA__
window.__INITIAL_STATE__
_next/image?url=
```

Nếu gặp:
```text
/_next/image?url=https%3A%2F%2Fcdn.domain.com%2F1.jpg&w=...
```

phải decode thành:
```text
https://cdn.domain.com/1.jpg
```

Lọc ảnh rác:
```text
logo
avatar
icon
banner
ads
advert
placeholder
favicon
```

Không có ảnh:
```js
Response.success([]);
```

---

## 16. NOVEL / CHINESE_NOVEL

Nếu là novel/chinese_novel, chap.js trả text/html đã clean:

```js
Html.clean(content, ["p", "br", "div"]);
```

Không trả menu, ads, comment, footer.

---

## 17. NEXTJS / REACT / API JSON

Nếu web dùng NextJS/React, phải kiểm tra:
```text
__NEXT_DATA__
script type="application/json"
window.__INITIAL_STATE__
API JSON trong Network
```

Nếu HTML không có dữ liệu nhưng script có JSON thì parse JSON/script.

Nếu ảnh nằm trong script thì dùng regex lấy toàn bộ URL ảnh.

---

## 18. DEBUG

Thêm Console.log:

```js
Console.log("home input: " + url);
Console.log("search url: " + url);
Console.log("list count: " + list.length);
Console.log("genre count: " + out.length);
Console.log("detail url: " + url);
Console.log("toc count: " + chapters.length);
Console.log("chap url: " + url);
Console.log("image count: " + images.length);
```

Không log HTML dài.

---

## 19. TEST

Hướng dẫn test:

```text
1. home.js
2. homecontent.js
3. genre.js
4. genrecontent.js
5. search.js
6. detail.js
7. toc.js
8. chap.js
```

Nếu lỗi, đọc log và sửa đúng file lỗi.

---

## 20. OUTPUT

Xuất:

1. ZIP hoàn chỉnh đúng cấu trúc:
```text
plugin.json
src/utils.js
src/home.js
src/homecontent.js
src/genre.js
src/genrecontent.js
src/search.js
src/detail.js
src/toc.js
src/chap.js
```

2. Giải thích:
```text
- Selector list truyện
- Selector search
- Selector genre
- Selector detail
- Selector toc
- Selector chap image
- Cách xử lý URL tiếng Việt
- Cách xử lý phân trang
```

3. Nếu phần nào phải đoán do thiếu HTML thì nói rõ.

---

## 21. DỮ LIỆU TÔI SẼ ĐIỀN

Tên extension:
[...]

Domain:
[...]

Loại:
[...]

NSFW:
[...]

Locale:
[...]

Trang chủ:
[...]

Trang list:
[...]

Trang thể loại:
[...]

Trang search thật:
[...]

Từ khóa test search:
[...]

URL truyện mẫu:
[...]

URL chap mẫu:
[...]

URL có tiếng Việt có dấu:
[...]

Danh sách tab Home:
```text
Tên tab:
URL
```

HTML card list:
```html
...
```

HTML card search:
```html
...
```

HTML detail:
```html
...
```

HTML toc:
```html
...
```

HTML chap:
```html
...
```

HTML pagination:
```html
...
```

HTML genre:
```html
...
```
