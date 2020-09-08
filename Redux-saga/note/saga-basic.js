const example1 = () => {
    function* gen() {
        console.log('a');
        console.log('b');
    }
    const g = gen();
    g.next();
}

// example1();

const example2 = () => {
    function* gen(i) {
        yield i;
        yield i + 10;
    }
    const g = gen(5);

    const res1 = g.next();
    console.log('1st g.next() result is ', res1);

    const res2 = g.next();
    console.log('2nd g.next() result is ', res2);

    const res3 = g.next();
    console.log('3rd g.next() result is ', res3);
}

// example2();

const example3 = () => {
    function* gen(i) {
        yield i;
        yield i + 10;
        return 25;
    }

    const g = gen(5);

    const res1 = g.next();
    console.log('1st g.next() result is ', res1);

    const res2 = g.next();
    console.log('2nd g.next() result is ', res2);

    const res3 = g.next();
    console.log('3rd g.next() result is ', res3);
}

example3();