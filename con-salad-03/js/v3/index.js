const $ = s => document.querySelector(s);

const render = d => (
    $('#loan_list').innerHTML =
        d.reduce((h, l) => (`
    ${h}
    <li class="loan_item">
        <div class="name_and_organization">
            <strong>${l.name}</strong>
            <span>${l.organization}</span>
        </div>
        <div class="limit_and_interest">
            한도 <span>${l.limit}</span>
            금리 <span>${l.interest.min} ~ ${l.interest.max}</span>
        </div>
    </li>
`), ''));

render(loans);

let current = {
    loans: loans,
    sort_by: 'register'
};

const compare_functions = {
    register: (a, b) => a.id - b.id,
    interest: (a, b) => a.interest.min - b.interest.min,
    limit: (a, b) => b.limit - a.limit
};

const add_event_listener = (selector, event_type, listener) => $(selector).addEventListener(event_type, listener);
const on_click_event = (selector, listener) => add_event_listener(selector, 'click', listener);
const on_change_event = (selector, listener) => add_event_listener(selector, 'change', listener);
const has_class = (element, class_name) => element.classList.contains(class_name);
const toggle_class = (element, class_name) => element.classList.toggle(class_name);
const set_state = (new_state) => (current = { ...current, ...new_state });
const event_log = (data) => console.log(data);

on_click_event('#is_prime', ({ currentTarget }) => {
    const has_class_all = has_class(currentTarget, 'all');
    let filter_name;

    if (has_class_all) {
        const only_prime = loan => loan.is_prime;
        const filtered_loans = current.loans.filter(only_prime);
        filter_name = 'only_prime';
        set_state({ loans: filtered_loans });
    } else {
        const by_sorting_criteria = compare_functions[current.sort_by];
        const sorted_loans = loans.sort(by_sorting_criteria);
        filter_name = 'all';
        set_state({ loans: sorted_loans });
    }

    const number_of_loans = current.loans.length + 1;
    event_log({
        screen_name: 'loans_page',
        number_of_loans: number_of_loans,
        filter_name: filter_name,
        event_name: 'click_filter',
        version: '1.0.0'
    });
    render(current.loans);
    toggle_class(currentTarget, 'all');
});

on_change_event('#sort', ({ currentTarget }) => {
    const sort_by = currentTarget.value;
    const by_sorting_criteria = compare_functions[sort_by];
    const sorted_loan = current.loans.sort(by_sorting_criteria);

    set_state({
        loans: sorted_loan,
        sort_by: sort_by
    });
    render(current.loans);
});
