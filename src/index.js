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

	// slider de seta para a direita
	rightButton.addEventListener("click", () => {
			const direction = 0.5;
			const scrollAmount = imageList.clientWidth * direction;
			imageList.scrollBy({ left: scrollAmount, behavior: "smooth" });
	});

	// slider de seta para a esquerda
	leftButton.addEventListener("click", () => {
			const direction = -0.5; // mudamos para um valor negativo para ir para a esquerda
			const scrollAmount = imageList.clientWidth * direction;
			imageList.scrollBy({ left: scrollAmount, behavior: "smooth" });
	});
};

window.addEventListener("load", initSlider);
