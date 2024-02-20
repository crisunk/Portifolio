// const initSlider = () => {
// 	const SlideButton = document.querySelectorAll(".misc__seta__wrapper")

// 	SlideButton.forEach(button => {
// 		button.addEventListener("click",() => {
// 			console.log(button)
// 		})
// 	})
// }

// window.addEventListener("load", initSlider)
// const initSlider = () => {
// 	const imageList = document.querySelector(".misc__wrapper .misc__gallery__wrapper")
// 	const SlideButtons = document.querySelectorAll(".misc__wrapper .misc__seta__wrapper")

// 	// slider de seta

// 	SlideButtons.forEach(button => {
// 		button.addEventListener("click",() => {
// 			const direction = 0.5
// 			const scrollAmount = imageList.clientWidth * direction
// 			imageList.scrollBy({ left: scrollAmount, behavior: "smooth"})
// 		})
// 	})
// }

// window.addEventListener("load", initSlider)

const initSlider = () => {
	const imageList = document.querySelector(".misc__wrapper .misc__gallery__wrapper");
	const rightButton = document.querySelector(".misc__wrapper .misc__seta__wrapper__right");
	const leftButton = document.querySelector(".misc__wrapper .misc__seta__wrapper__left");
	const SlideButtons = [leftButton, rightButton];
	const sliderScrolbar = document.querySelector(".misc .slider__scrollbar ");
	const scrollbarThumb = sliderScrolbar.querySelector(".scrollbar__thumb");
	const maxScrollLeft = imageList.scrollWidth - imageList.clientWidth;


	// atualizar o marcador ao arrastar o mouse
	scrollbarThumb.addEventListener("mousedown",(e) => {
		const startX = e.clientX
		const thumbPosition = scrollbarThumb.offsetLeft

		// atualizar a posição quanto mouse anda
		const handleMouseMove = (e) => {
			const deltaX = e.clientX - startX
			const newThumbPosition = thumbPosition + deltaX
			const maxThumbPosition = sliderScrolbar.getBoundingClientRect().width - scrollbarThumb.offsetWidth

			const boundedPosition = Math.max(0, Math.min(maxThumbPosition, newThumbPosition ))
			const scrollPosition = (boundedPosition / maxThumbPosition ) * maxScrollLeft


			scrollbarThumb.style.left = `${boundedPosition}px`
			imageList.scrollLeft = scrollPosition
		}

		//remove track do mouse ao arrastar
		const handleMouseUp = () => {
			document.removeEventListener("mousemove", handleMouseMove )
			document.removeEventListener("mouseup", handleMouseUp )

		}

		//add evento ao fazer o drag
		document.addEventListener("mousemove", handleMouseMove )
		document.addEventListener("mouseup", handleMouseUp )
	})

	// slider de seta para a direita
	rightButton.addEventListener("click", () => {
			const direction = 1;
			const scrollAmount = imageList.clientWidth * direction;
			imageList.scrollBy({ left: scrollAmount, behavior: "smooth" });
	});

	// slider de seta para a esquerda
	leftButton.addEventListener("click", () => {
			const direction = -1;
			const scrollAmount = imageList.clientWidth * direction;
			imageList.scrollBy({ left: scrollAmount, behavior: "smooth" });
	});

	const handleSlideButtons = () => {
			SlideButtons[0].style.display = imageList.scrollLeft <= 0 ? "none" : "block";
			SlideButtons[1].style.display = imageList.scrollLeft >= maxScrollLeft ? "none" : "block";
	};
	// atualizar a barra de scroll baseada no scroll da imagem

	const updateScrollThumbPosition = () => {
		const scrollPosition = imageList.scrollLeft
		const thumbPosition = (scrollPosition / maxScrollLeft ) * (sliderScrolbar.clientWidth - scrollbarThumb.offsetWidth)
		scrollbarThumb.style.left = `${thumbPosition}px`
	}
	imageList.addEventListener("scroll", () => {
			handleSlideButtons()
			updateScrollThumbPosition()
	});
};

window.addEventListener("load", initSlider);

