import { createElement } from "react";
import { render, fireEvent } from "@testing-library/react";
import { ValueStatus } from "mendix";

import CustomDropdown from "./index";

interface Value {
    status: ValueStatus;
    items: Item[];
}

interface Item {
    firstLabel: {
        displayValue: string;
    };
    secondLabel: {
        displayValue: string;
    };
    imgUrl: {
        status: ValueStatus;
        displayValue: string;
    };
}

const items = [
    {
        firstLabel: { displayValue: "label1" },
        secondLabel: { displayValue: "secondLabel1" },
        imgUrl: {
            status: ValueStatus.Available,
            displayValue: "url1"
        }
    },
    {
        firstLabel: { displayValue: "label2" },
        secondLabel: { displayValue: "secondLabel2" },
        imgUrl: {
            status: ValueStatus.Available,
            displayValue: "url2"
        }
    },
    {
        firstLabel: { displayValue: "label3" },
        secondLabel: { displayValue: "secondLabel3" },
        imgUrl: {
            status: ValueStatus.Available,
            displayValue: "url3"
        }
    }
];

const defaultValue = (): Value => ({
    status: ValueStatus.Available,
    items: items.slice(0, 1)
});

const options = {
    status: ValueStatus.Available,
    items
};

const renderComponent = (override = {}) => {
    const props = {
        defaultValue: defaultValue(),
        firstLabelDefaultValue: item => item.firstLabel,
        secondLabelDefaultValue: item => item.secondLabel,
        imgUrlDefaultValue: item => item.imgUrl,
        options,
        firstLabelOptions: item => item.firstLabel,
        secondLabelOptions: item => item.secondLabel,
        imgUrlOptions: item => item.imgUrl,
        contextObjLabel: {
            status: ValueStatus.Available,
            value: null
        },
        enableCreate: true,
        enableClear: true,
        enableSearch: true,
        useAvatar: true,
        useDefaultStyle: true,
        placeholder: "placeholder",
        className: "custom-dropdown",
        classNamePrefix: "test",
        menuHeight: 0,
        ...override
    };
    // @ts-ignore
    return render(<CustomDropdown {...props} />);
};

describe("Custom dropdown component", () => {
    describe("when menu is shown", () => {
        let container;

        beforeEach(() => {
            const component = renderComponent({ enableCreate: true });
            container = component.container;

            const downButton = container.querySelector("div.test__dropdown-indicator");

            fireEvent.mouseDown(downButton, { button: 1 });

            // for printing the HTML
            // const { debug } = component;
            // debug();
        });

        it("- should render menu", () => {
            const menu = container.querySelector("div.test__menu");
            expect(menu).not.toBeNull();
        });

        it("- should render menu items", () => {
            const allAvatars = container.querySelectorAll("div.test__option > div.test__avatar");

            expect(allAvatars).toHaveLength(3);
            expect(allAvatars[0].style["background-image"]).toContain("url1");
            expect(allAvatars[1].style["background-image"]).toContain("url2");
            expect(allAvatars[2].style["background-image"]).toContain("url3");

            const allNames = container.querySelectorAll("div.test__option > div.test__name");
            expect(allNames).toHaveLength(6);
            expect(allNames[0].innerHTML).toBe("label1");
            expect(allNames[1].innerHTML).toBe("secondLabel1");
            expect(allNames[2].innerHTML).toBe("label2");
            expect(allNames[3].innerHTML).toBe("secondLabel2");
            expect(allNames[4].innerHTML).toBe("label3");
            expect(allNames[5].innerHTML).toBe("secondLabel3");
        });
    });

    describe("when clear button is pressed", () => {
        let component;
        const clearValue = jest.fn();
        const contextObjLabelSetValue = jest.fn();
        const contextObjIdSetValue = jest.fn();

        beforeEach(() => {
            component = renderComponent({
                clearValue: {
                    canExecute: true,
                    execute: clearValue
                },
                contextObjLabel: {
                    status: ValueStatus.Available,
                    value: null,
                    setValue: contextObjLabelSetValue
                },
                contextObjId: {
                    status: ValueStatus.Available,
                    value: null,
                    setValue: contextObjIdSetValue
                }
            });

            const clearButton = component.container.querySelector("div.test__clear-indicator");
            fireEvent.mouseDown(clearButton, { button: 0 });
        });

        it("- should show the placeholder", () => {
            const placeholder = component.container.querySelector("div.test__value-container > div.test__placeholder");
            expect(placeholder).not.toBeNull();
        });

        it("- should call clearValue action", () => {
            expect(clearValue).toHaveBeenCalledTimes(1);
        });
    });

    describe("New entry is created", () => {
        let component;
        const createValue = jest.fn();
        const contextObjLabelSetValue = jest.fn();
        const contextObjIdSetValue = jest.fn();

        beforeEach(() => {
            component = renderComponent({
                createValue: {
                    canExecute: true,
                    execute: createValue
                },
                contextObjLabel: {
                    status: ValueStatus.Available,
                    value: null,
                    setValue: contextObjLabelSetValue
                },
                contextObjId: {
                    status: ValueStatus.Available,
                    value: null,
                    setValue: contextObjIdSetValue
                }
            });

            const inputValue = component.container.querySelector("div.test__input > input");
            fireEvent.change(inputValue, { target: { value: "This is a new value" } });
        });

        it("- should show option to create value", () => {
            expect(component.container.querySelector("div.test__menu-list > div.test__option")!.textContent).toBe(
                'Create "This is a new value"'
            );
        });

        describe("and Enter key down", () => {
            beforeEach(() => {
                const createOption = component.container.querySelector("div.test__menu-list > div.test__option");
                fireEvent.keyDown(createOption, { key: "Enter", code: "Enter" });
            });

            it("- should create a value", () => {
                expect(createValue).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("Selection is changed", () => {
        let component;
        const selectOption = jest.fn();
        const contextObjLabelSetValue = jest.fn();
        const contextObjIdSetValue = jest.fn();

        beforeEach(() => {
            component = renderComponent({
                selectOption: {
                    canExecute: true,
                    execute: selectOption
                },
                contextObjLabel: {
                    status: ValueStatus.Available,
                    value: null,
                    setValue: contextObjLabelSetValue
                },
                contextObjId: {
                    status: ValueStatus.Available,
                    value: null,
                    setValue: contextObjIdSetValue
                }
            });

            const inputValue = component.container.querySelector("div.test__input > input");
            fireEvent.change(inputValue, { target: { value: "label3" } });
        });

        it("- should show value in menu", () => {
            expect(component.container.querySelector("div.test__menu-list > div.test__option")!.textContent).toBe(
                "label3secondLabel3"
            );
        });

        it("- should select the value", () => {
            const createOption = component.container.querySelector("div.test__menu-list > div.test__option");

            fireEvent.keyDown(createOption, { key: "Enter", code: "Enter" });
            expect(selectOption).toHaveBeenCalledTimes(1);
        });
    });

    describe("when options are loading", () => {
        let container;

        beforeEach(() => {
            const component = renderComponent({
                options: {
                    status: ValueStatus.Loading,
                    items: []
                }
            });
            container = component.container;
        });

        it("- should show loading icon", () => {
            const indicator = container.querySelector("div.test__loading-indicator");
            expect(indicator).not.toBeNull();
        });
    });

    describe("when default item is loading", () => {
        let container;

        beforeEach(() => {
            const component = renderComponent({
                defaultValue: {
                    status: ValueStatus.Loading,
                    items: []
                }
            });
            container = component.container;
        });

        it("- should show loading icon", () => {
            const indicator = container.querySelector("div.test__loading-indicator");
            expect(indicator).not.toBeNull();
        });
    });
});
