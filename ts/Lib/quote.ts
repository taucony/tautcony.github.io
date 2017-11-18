namespace Lib {
export interface Info {
    tagName: string;
    className?: string;
    cssText?: string;
    content: string | HTMLElement[];
}

interface IFormat {
    org: string;
    jpn: string;
    chi: string;
    aut: string;
    sou: string;
}

export class Quote {
    private container: HTMLElement;
    private quotes: IFormat[];
    public constructor(containerSelector: string, className: string) {
        this.FetchData(() => {
            const wrapper = this.CreateElement({
                tagName: "div",
                className,
                content: this.CreateQuote()
            });
            document.querySelector(containerSelector).appendChild(wrapper);
            this.container = document.querySelector(`${containerSelector} .${className}`) as HTMLElement;
            this.UpdateQuote();
        });
    }

    public UpdateQuote() {
        const quote = this.RandomQuote();
        this.container.querySelector(".quote-content").textContent = quote.text;
        this.container.querySelector(".quote-author").textContent  = `—— ${quote.author} 《${quote.source}》`;
    }

    public Interval(timeout: number) {
        setInterval(() => {
            this.UpdateQuote();
        }, timeout);
    }

    private FetchData(callBack: () => void) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "/json/quote.json", true);
        xhr.onload = () => {
            if (xhr.readyState === 4 && xhr.getResponseHeader("content-type").indexOf("application/json") !== -1) {
                this.quotes = JSON.parse(xhr.responseText) as IFormat[];
                callBack();
            } else {
                console.error(xhr);
            }
        };
        xhr.onerror = () => {
            console.error(xhr.statusText);
        };
        xhr.send();
    }

    private RandomQuote = () => {
        const quote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
        const [...textArray] = [quote.org, quote.chi, quote.jpn].filter(item => item !== undefined);
        const text = textArray[Math.floor(Math.random() * textArray.length)];
        return {
            text,
            author: quote.aut,
            source: quote.sou
        };
    }

    private CreateElement = (info: Info) => {
        const className = info.className !== undefined ? info.className : "";
        const style = info.cssText !== undefined ? info.cssText : "";
        const element = document.createElement(info.tagName);
        element.className = className;
        element.style.cssText = style;
        if (typeof info.content === "string") {
            element.textContent = info.content;
        } else {
            info.content.forEach(item => {
                element.appendChild(item);
            });
        }
        return element;
    }

    private CreateQuote = () => {
        const quoteDiv = this.CreateElement({
            tagName:   "div",
            className: "quote-content",
            cssText:   "margin-top:2em;margin-bottom:-2em;",
            content:   ""
        });
        const authorDiv = this.CreateElement({
            tagName:   "small",
            className: "quote-author",
            cssText:   "margin-left:16em;",
            content:   ""
        });
        return [quoteDiv, document.createElement("br"), authorDiv];
    }
}
}