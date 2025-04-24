const MIN_VEHICLE_PRICE = 10000

const pages = document.querySelectorAll('.page')
const vehicleType = document.querySelector('#vehicle-types-set')
const vehiclePrice = document.querySelector('#vehicle-price')
const loanPeriod = document.querySelector('#loan-period')
const education = document.querySelector('#education-set')
const educations = document.querySelectorAll(".checkbox-education")

const financing = document.querySelector("#financing")

const previousPage = document.querySelector("#button-previous")
const nextPage = document.querySelector("#button-next")

let totalPages = pages.length
let currentPage = 0

let choiceVehicleType = ""
let choiceVehiclePrice = ""
let choiceLoanPeriod = ""
let choiceEducation = []
let choiceFinancing = ""

const inputs = {
    1: {
        isValid: () => choiceVehicleType.length > 0,
        errorMsg: "Palun vali sõiduki tüüp.",
        element: vehicleType,
    },
    2: {
        isValid: () => choiceVehiclePrice >= MIN_VEHICLE_PRICE,
        errorMsg: `Miinimum sõiduki hind on ${MIN_VEHICLE_PRICE} EUR.`,
        element: vehiclePrice
    },
    3: {
        isValid: () => choiceLoanPeriod > 0,
        errorMsg: "Palun vali laenuperiood.",
        element: loanPeriod,
    },
    4: {
        isValid: () => choiceEducation.length > 0,
        errorMsg: "Palun vali haridus.",
        element: education,
    },
    5: {
        isValid: () => choiceFinancing.length > 0,
        errorMsg: "Palun sisesta sissetuleku allikad.",
        element: financing
    }
}

pages[currentPage].classList.add('active')

nextPage.addEventListener('click', () => {handlePageButtonClick(1)})
previousPage.addEventListener('click', () => {handlePageButtonClick(-1)})

vehicleType.addEventListener('change', (e) => {
    choiceVehicleType = e.target.value
    handleError(true, e)
})

let timeout
vehiclePrice.addEventListener('input', (e) => {
    clearTimeout(timeout)

    choiceVehiclePrice = e.target.value

    timeout = setTimeout(() => {
        if (choiceVehiclePrice < MIN_VEHICLE_PRICE) {
            choiceVehiclePrice = "";
            handleError(false, e.target, inputs[currentPage].errorMsg)
        } else {
            handleError(true, e.target);
        }
    }, 500)
})

loanPeriod.addEventListener('change', (e) => {
    choiceLoanPeriod = e.target.value
    if (choiceLoanPeriod === "")
        handleError(false, e.target, inputs[currentPage].errorMsg)
    else handleError(true, e.target)
})

educations.forEach(education => {
    education.addEventListener('change', (e) => {
        if (e.target.checked) choiceEducation.push(e.target.value)
        else choiceEducation = choiceEducation.filter(education => education !== e.target.value)

        if (choiceEducation.length > 0) handleError(true, e.target)
        else handleError(false, e.target, inputs[currentPage].errorMsg)
    })
})

financing.addEventListener('input', (e) => {
    choiceFinancing = e.target.value

    if (choiceFinancing?.length === 0) {
         handleError(false, e.target, inputs[currentPage].errorMsg)
    } else handleError(true, e.target)
})

function handlePageButtonClick(direction) {
    const input = inputs[currentPage]

    if (direction === 1 && currentPage > 0 && !input.isValid()) {
        handleError(false, input.element, input.errorMsg)
        return
    }

    pages[currentPage].classList.toggle('active')
    currentPage += direction
    pages[currentPage].classList.toggle('active')

    previousPage.disabled = currentPage === 0
    nextPage.disabled = currentPage === totalPages - 1

    if (currentPage === totalPages - 1) updateSummary()
    else if (currentPage > 0) focusOnInput(inputs[currentPage].element)
}

function handleError(isValid, element, errorMsg = "") {
    const error = pages[currentPage].querySelector(".error-message")
    error.textContent = errorMsg

    if (isValid) {
        element.ariaInvalid = "false"
    } else {
        element.ariaInvalid = "true"
        focusOnInput(element)
    }
}

function focusOnInput(element) {
    if (element.nodeName === "FIELDSET") {
        element.querySelector("input")?.focus()
    } else element.focus()
}

function updateSummary() {
    const vehicleType = document.querySelector('#info-table-vehicle-type')
    const vehiclePrice = document.querySelector('#info-table-vehicle-price')
    const loanPeriod = document.querySelector('#info-table-loan-period')
    const education = document.querySelector('#info-table-education')
    const financing = document.querySelector('#info-table-financing')

    const priceUnit = " EUR"
    const loanPeriodUnit = " aastaks"

    vehicleType.textContent = choiceVehicleType
    vehiclePrice.textContent = choiceVehiclePrice + priceUnit
    loanPeriod.textContent = choiceLoanPeriod + loanPeriodUnit
    education.textContent = choiceEducation.join(", ")
    financing.textContent = choiceFinancing
}
