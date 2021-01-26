# HTML, CSS, ES5, jQuery 에서 복습 및 배울것
	1. css FlexModel
	2. css Bootstrap
	3. Swiper Plugin
	4. Javascript 심도
	5. jQuery 리뷰

# jQuery 리뷰
## jQuery 는 함수(메서드)로 만들어져 있다.
```js
var $ = jQuery
jQuery(".wrap").hide();
$(".wrap").hide();

// 다음중 올바른 표현을 고르시오.
$(".a").hasClass("b").hide();
$(".a").append('<div>A</div>').hide(); //정답
$(".a").width().hide();
$(".a").attr("id").hide();

// 다음의 문장을 Javascript로 변환하세요.
$("#sample")
document.getElementById("sample")
```

### 0. Selector(선택자) : return jQuery
	[Selector의 모든것](https://www.w3schools.com/jquery/jquery_ref_selectors.asp)
	- find() children() eq() siblings() parent() parents() next() prev()
```js
// 태그나 객체를 $() 로 실행하면 jQuery 객체가 리턴된다.
$(".a")
$("div")
$(".a > div")
$(document.getElementById('sample'))
$('<div>A</div>')
$('div', '.wrap') => .wrap 안의 div $('.wrap').find('div')와 같다
$('div, .wrap')	=> div 와 .wrap 같이 선택

// $()[0] => 자바스크립트가 된다
$("#sample")[0] // 자바스크립트
```

### 1. Animation : return jQuery
	[애니메이션의 모든것](https://www.w3schools.com/jquery/jquery_ref_effects.asp)
	- hide() show() fadeIn() fadeOut() slideUp() slideDown() toggle() fadeToggle() slideToggle() animate()

### 2. DOM(Document Object Model) : return jQuery
	[DOM의 모든것](https://www.w3schools.com/jquery/jquery_ref_html.asp)
	- append() appendTo() prepend() prependTo() remove() empty(), html(), text()
```js
$('.a').append('<div>A</div>').click() 		// return $('.a')
$('<div>A</div>').appendTo('.a').click() 	// return $('<div>A</div>')
```

### 3. Attribute, dataSet
	- Getter: attr('속성')
	- Setter: attr('속성', '값')
	- Getter: data('키');
	- Setter: data('키', '값');
```html
<div class="a" id="A"></div>
```
```js
$(".a").attr("id");	// "A"
$(".a").attr("id", "B")	// id="B", jQuery
$(".a").attr({
	id: "C",
	style: "background-color: #ccc"
});
```
### 4. CSS
	- Getter: css('속성')
	- Setter: css('속성', '값')
	- Setter: css({ '속성': '값', ... })
	- addClass('클래스명') removeClass('클래스명') toggleClass('클래스명')
	- hasClass('클래스명')

### 5. Dimension
	[크기의 모든것](https://www.w3schools.com/jquery/jquery_dimensions.asp)
	- width() height() 
	- innerWidth() innerHeight() 
	- outerWidth() outerHeight() 
	- outerWidth(true) outerHeight(true)
	- offset() => return {top: 200, left: 100}
	- offset().top / offset().left
	- position().top / position().left
	- scrollTop()

### 6. Event
	[이벤트의 모든것](https://www.w3schools.com/jquery/jquery_ref_events.asp)
	- click(), hover(), mouseover(), mouseleave(), mouseenter(), keyup(), keydown(), resize(), scroll() ... 

# Javascript Review
## 프로그래밍은 변수와 함수의 집합니다.

### 변수
1. Primmitive(원시) Type
	- String, Number, Boolean, undefined
2. Reference(참조) Type
	- Array, Object, Null

```js
var arr = [1, 2, 3];
var arr2 = arr;
console.log(arr, arr2); // [1, 2, 3] (3) [1, 2, 3]
arr.push(4)
arr.push(5)
console.log(arr, arr2); // [1, 2, 3, 4, 5] (5) [1, 2, 3, 4, 5]

// 0, false, null, undefined => false
```

### 2020-12-09 숙제
#### 구구단을 만드세요.
2단 2 x 1 =2 2 x 2 = 4 ...
3단
.
.
.

    2단        3단       4단      5단 ...
2 x 1 = 2   3 x 1 = 3
2 x 2 = 4
.
.
.