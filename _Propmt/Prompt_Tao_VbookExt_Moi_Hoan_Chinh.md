# PROMPT HOÀN CHỈNH TẠO EXTENSION VBOOK MỚI

Bạn là chuyên gia viết extension cho phần mềm đọc sách Vbook.

Tôi muốn tạo một extension Vbook mới cho website truyện. Hãy phân tích kỹ website dựa trên URL và HTML mẫu tôi cung cấp, sau đó viết extension hoàn chỉnh đúng chuẩn Vbook.

Mục tiêu:

- Extension chạy được trên Vbook.
- Đúng cấu trúc file.
- Không tự ý đặt tên file sai với plugin.json.
- Không dùng hàm không tồn tại trong môi trường Vbook.
- Có xử lý URL tiếng Việt có dấu.
- Có xử lý URL bị encode như `%C4%91`.
- Có xử lý ảnh lazy-load, NextJS image, CDN image.
- Có xử lý search đúng URL thật của website.
- Có fallback để tránh app bị văng lỗi.

---

## 1. THÔNG TIN WEBSITE

Tên extension:
[...]

Tên hiển thị:
[...]

Domain:
[...]

Ví dụ:
https://abc.com

Loại truyện:
[comic / novel / chinese_novel]

NSFW:
[yes / no]

Locale:
[vi_VN / en_US / zh_CN...]

Author extension:
[VbookT]

Version:
[1]

Mô tả:
[Extension đọc truyện từ website ...]

---

## 2. URL MẪU CẦN CUNG CẤP

Trang chủ:
[...]

Trang danh sách truyện:
[...]

Trang thể loại:
[...]

Trang tìm kiếm:
[...]

URL search thật sau khi tìm thử trên trình duyệt:
[...]

Ví dụ:
https://abc.com/search?q=Big

Trang truyện mẫu:
[...]

Trang chap mẫu:
[...]

URL truyện có tiếng Việt có dấu nếu có:
[...]

URL chap có slug đặc biệt nếu có:
[...]

---

## 3. HTML MẪU CẦN DÁN

### 3.1 HTML card truyện ở trang chủ/list

```html
[PASTE HTML CARD TRUYỆN]
```

### 3.2 HTML card truyện ở trang search

```html
[PASTE HTML CARD SEARCH]
```

### 3.3 HTML trang detail/trang truyện

```html
[PASTE HTML DETAIL]
```

### 3.4 HTML danh sách chap / toc

```html
[PASTE HTML TOC]
```

### 3.5 HTML nội dung chap

```html
[PASTE HTML CHAP]
```

### 3.6 HTML phân trang nếu có

```html
[PASTE HTML PAGINATION]
```

### 3.7 HTML thể loại nếu có

```html
[PASTE HTML GENRE]
```

---

## 4. FILE PHẢI TẠO

Hãy tạo đầy đủ các file sau:

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

Nếu website không có genre hoặc search thì vẫn tạo file nhưng trả dữ liệu rỗng hoặc xử lý hợp lý.

Không được tự ý đổi tên file.

Tên script trong plugin.json phải khớp với file thật.

---

## 5. CẤU TRÚC PLUGIN.JSON

Tạo plugin.json theo mẫu:

```json
{
  "metadata": {
    "name": "[Tên extension]",
    "author": "[Author]",
    "version": 1,
    "source": "[Domain]",
    "regexp": "https?:\/\/(www\.)?domain\.com\/...",
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

Nếu NSFW = yes thì dùng:

```json
"tag": "nsfw"
```

---

## 6. QUY TẮC CODE VBOOK

Môi trường Vbook dùng JavaScript kiểu Rhino, nên phải viết code tương thích.

Bắt buộc:

```js
function execute(...) {
}
```

Không dùng entry function tên khác.

Nên dùng:

```js
var
for loop
doc.select(...)
elements.get(i)
elements.size()
Response.success(...)
```

Hạn chế hoặc không dùng nếu không chắc Vbook hỗ trợ:

```js
let
const
arrow function =>
optional chaining ?.
array.map
array.filter
array.forEach
.first()
.parent()
appendHost()
```

Không được gọi hàm chưa chắc có trong utils.js.

Nếu dùng hàm helper thì phải định nghĩa trong `utils.js`.

Mọi request phải có `try/catch`.

Nếu lỗi, trả dữ liệu rỗng hợp lệ:

```js
return Response.success([], null);
```

hoặc:

```js
return Response.success([]);
```

Không để app báo lỗi kiểu:

```text
ReferenceError
NullPointer
Attempt to invoke interface method
response null
```

---

## 7. QUY TẮC UTILS.JS

Trong `utils.js` phải có tối thiểu:

```js
var BASE_URL = "https://domain.com";
var HOST = "https://domain.com";
```

Phải có helper:

```js
function safeDecodeUrl(url) {}
function safeEncodeUrl(url) {}
function toAbsoluteUrl(url) {}
function normalizeCompareUrl(url) {}
function getDoc(url) {}
function cleanText(text) {}
function isBadLink(url, text) {}
function uniquePush(list, item, key) {}
```

Yêu cầu URL:

- Link trả về cho Vbook nên là absolute URL.
- Nếu URL có tiếng Việt có dấu, link trả về nên ở dạng encoded.
- Khi so sánh nội bộ thì dùng decode.
- Không được double encode.

Sai:

```text
%C4%91 -> %25C4%2591
```

Đúng:

```text
đ -> %C4%91
%C4%91 -> %C4%91
```

---

## 8. QUY TẮC FETCH / GETDOC

`getDoc(url)` phải:

- Nhận cả URL đã encode và chưa encode.
- Không double encode.
- Có User-Agent Android.
- Có Referer nếu cần.
- Trả `null` nếu lỗi, không làm app crash.

Ví dụ logic:

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

Nếu website dùng Cloudflare hoặc JS render, có thể fallback bằng browser.

---

## 9. HOME.JS

`home.js` trả danh sách tab khám phá.

Ví dụ:

```js
function execute() {
    return Response.success([
        {
            title: "Truyện mới cập nhật",
            input: BASE_URL + "/danh-sach",
            script: "homecontent.js"
        }
    ]);
}
```

---

## 10. HOMECONTENT.JS / GENRECONTENT.JS / SEARCH.JS

Các file lấy list truyện phải trả:

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

### Quy tắc lọc link rác

Phải lọc các link/text chứa:

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

Không được để xuất hiện item như:

```text
Đăng nhập
Đăng ký
Đăng truyện
Manage
Trang dịch giả
Tài khoản
```

### Quy tắc cover

Lấy cover từ:

```text
img src
img data-src
img data-original
img data-lazy-src
srcset
```

Nếu cover là link tương đối thì đổi thành absolute.

### Quy tắc phân trang

Nếu có next page:

```js
return Response.success(list, String(pageNo + 1));
```

Nếu không:

```js
return Response.success(list, null);
```

Không để next sai gây lặp vô hạn.

---

## 11. SEARCH.JS

Search phải dùng đúng URL search thật của website.

Không được đoán sai query param.

Ví dụ nếu trình duyệt search là:

```text
https://domain.com/search?q=Big
```

thì code phải dùng:

```js
BASE_URL + "/search?q=" + encodeURIComponent(key)
```

Không được dùng sai:

```js
/search?keyword=
/tim-kiem?keyword=
```

trừ khi website thật sự dùng như vậy.

`search.js` nên parse riêng theo HTML card search nếu card search khác với card list.

Không được phụ thuộc hoàn toàn vào `parseComicList()` nếu search HTML khác list HTML.

Không dùng hàm chưa định nghĩa như:

```js
appendHost()
```

Nếu cần nối domain thì dùng:

```js
var link = href;
if (link.indexOf("http") !== 0) {
    link = BASE_URL + link;
}
```

---

## 12. DETAIL.JS

`detail.js` nhận URL truyện:

```js
function execute(url) {
}
```

Phải xử lý được URL Vbook gửi vào ở dạng encoded.

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
        {
            title: "Action",
            input: "https://domain.com/genres/action",
            script: "genrecontent.js"
        }
    ]
});
```

Nếu thiếu trường nào thì để rỗng, không báo lỗi.

---

## 13. TOC.JS

`toc.js` lấy danh sách chap.

Không được giả định chap luôn dạng:

```text
chap-1
chap-2
chap-3
```

Phải hỗ trợ chap slug tự do:

```text
coming-soon
cunny-ma-fap-uogghhh
chap-1-khong-che
mot-mau-anh-dung-ky-nang...
slug tiếng Việt có dấu
```

Quy tắc:

- Ưu tiên selector dựa trên HTML mẫu.
- Nếu HTML có `aria-label="Đọc chương 1"` thì dùng selector đó.
- Nếu không, lấy tất cả link con nằm dưới URL truyện.
- Không lọc chap chỉ vì URL không có chữ `chap`.
- Không bỏ `coming-soon` nếu trang đó có ảnh.
- Không lấy link tác giả/dịch giả/login/manage/tag/genre.

Trả:

```js
Response.success([
    {
        name: "Chap 1",
        url: "https://domain.com/truyen/abc/chap-1",
        host: BASE_URL
    }
]);
```

Nếu không có chap:

```js
Response.success([]);
```

Không dùng `Response.error` nếu không cần.

---

## 14. CHAP.JS CHO COMIC

`chap.js` phải trả danh sách ảnh, không trả HTML.

Sai:

```js
Response.success("<p><img src='...'></p>");
```

Đúng:

```js
Response.success([
    {
        link: "https://cdn.domain.com/image1.jpg",
        fallback: "https://cdn.domain.com/image1.jpg"
    }
]);
```

Phải lấy tất cả ảnh, không chỉ ảnh đầu.

Nguồn ảnh cần hỗ trợ:

```text
img src
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

### Xử lý NextJS image

Nếu gặp:

```text
/_next/image?url=https%3A%2F%2Fcdn.domain.com%2Fimage.jpg&w=...
```

Phải decode thành:

```text
https://cdn.domain.com/image.jpg
```

Ưu tiên trả ảnh CDN thật, không trả URL `_next/image`.

### Lọc ảnh rác

Bỏ ảnh chứa:

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

Nếu không có ảnh:

```js
Response.success([]);
```

Không để app crash.

---

## 15. NOVEL / CHINESE_NOVEL

Nếu loại là `novel` hoặc `chinese_novel`, `chap.js` trả nội dung text/html đã clean.

Dùng:

```js
Html.clean(content, ["p", "br", "div"]);
```

Không trả menu, ads, comment, footer.

---

## 16. NEXTJS / REACT / API JSON

Nếu website dùng NextJS/React:

Phải kiểm tra:

```text
__NEXT_DATA__
script type="application/json"
window.__INITIAL_STATE__
API JSON trong network
```

Nếu HTML không có dữ liệu nhưng script có JSON, phải parse JSON/script để lấy:

- list truyện
- detail
- toc
- image list

Nếu ảnh nằm trong script, phải dùng regex để lấy tất cả URL ảnh.

---

## 17. DEBUG

Thêm `Console.log()` ở các điểm quan trọng:

```js
Console.log("search url: " + url);
Console.log("list count: " + list.length);
Console.log("detail url: " + url);
Console.log("toc count: " + chapters.length);
Console.log("chap url: " + url);
Console.log("image count: " + images.length);
```

Không log quá nhiều HTML dài.

---

## 18. TEST THỨ TỰ

Sau khi tạo extension, hướng dẫn test theo thứ tự:

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

Nếu lỗi, cần đọc log:

```text
ReferenceError
TypeError
NullPointer
Response status -1
```

và sửa đúng file bị lỗi.

---

## 19. OUTPUT CUỐI CÙNG

Hãy xuất:

1. File ZIP hoàn chỉnh đúng cấu trúc:

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

2. Giải thích ngắn:

```text
- Selector list truyện:
- Selector search:
- Selector detail:
- Selector toc:
- Selector chap image:
- Cách xử lý URL tiếng Việt:
- Cách xử lý phân trang:
```

3. Nếu phần nào phải đoán vì thiếu HTML, phải nói rõ.

4. Không chỉ trả code rời rạc, ưu tiên tạo ZIP để tải về.

---

## 20. DỮ LIỆU WEBSITE CẦN TÔI ĐIỀN

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
