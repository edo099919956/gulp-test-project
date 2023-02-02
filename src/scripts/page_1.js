const popup = document.querySelector('.popup')

document.querySelector('.popup__wrap__btnClose').addEventListener('click', () => {
    popup.classList.add('hide')
})

document.querySelector('.article__link').addEventListener('click', () => {
    popup.classList.remove('hide')
})
// -------------------------------------------------------
const mib_panel_op_close = document.querySelector('.navCont__list__mob')

document.querySelector('.navCont__logo__closeBtn').addEventListener('click', () => {
    mib_panel_op_close.classList.add('hide')
})

document.querySelector('.navCont__logo__mobBurger').addEventListener('click', () => {
    mib_panel_op_close.classList.remove('hide')
})
// -------------------------------------------------------