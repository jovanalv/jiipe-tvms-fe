import "./ButtonExport.scss";

const ButtonExport = ({ label, index, buttonLength, onClick }) => {
  const tooltipText = {
    Copy: "Copy",
    Excel: "Excel",
    PDF: "PDF",
    Print: "Print",
  };

  return (
    <div
      className={`button-export ${
        index === 0 ? "first" : index === buttonLength - 1 ? "last" : ""
      }`}
      onClick={onClick}
    >
      <div className="tooltip">{tooltipText[label]}</div>
      {label === "Copy" && (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <rect width="24" height="24" fill="url(#pattern0_279_1823)" />
          <defs>
            <pattern
              id="pattern0_279_1823"
              patternContentUnits="objectBoundingBox"
              width="1"
              height="1"
            >
              <use xlinkHref="#image0_279_1823" transform="scale(0.0111111)" />
            </pattern>
            <image
              id="image0_279_1823"
              width="90"
              height="90"
              xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAACwklEQVR4nO2cvYoUQRDHGxU1UB9ADQ/FBZ2uA/e6BmQwkVPEbLoOLjAy8yM09CEUX8TAJ1AxOu8Z1MhITtGNTuZWMHD3bvbmo2p6/j+ocPbjt9X/7q1lxzkAAAAAgGQpiodnPcszYvlIHH8Qy34PNaMQ32WhnLoxcH26fdlz3O1J7n/lQ/yV5XLHpd/JUU3yaGT7eVyoSh6FbDrIZH3JycumIHsqQll+jko2KXXuei63Dv2Qg/xeZ7nvUoGURFfPPSrZpCh6VLJJWfRoZJMB0aOQTUZEJy+bDIlOWjYZE52sbDIo2rzsw0adQxNdkeXxtrlvkEeNOoco2pzsOqPOoYquLbuPHw/qjDqtiaZ862KbsqtfapyFUac50SzPV32fR8ieOQujToOiZ5XsNjvbdU2dN9bkWhpIQTRDtNPuQnQ064tDdLC+VGQ0QzROHU1psqzIwJJHdLC+PGQ064utu2pbA9EhEE3o6Dnayx3RwfrikNGsLxWbIUP0QshAJ6KjWV8eooPtleuaJi+CDAiCaNaXh45mfbGIDoZoZHQTsBkKTh2EjJ6jvYFhM2R9cTh1sL5UHO8YohdCBjoRHc368hAdbK9c19R5EVfzB+ct3RiFWi7P8bsJ0TduypUh3OqHjis6yAcTov2G3F10reetp9qSWqkgj22IDvHVomvXNjfPUJBPA5e8M5mUp02IJo6fi6I4texftzRU2UF2slBe6lxyfdGyn+Xlo2WPsXbQ2fFJlXXmN8ggez7I+youeunkVUX7EL8uO32AGqzSDZ7j27IsT0LsMVh16XmOL517cQKyOxb9N0beTKfbFyC7Y9E07+xv1Z0Rlp1GQEui6V99IY6vfR7v0YZcmxTlOUhusaPJYJn+gLXlEETri6OkOtr6Nzk2NOpsAkadPYFRZ09g1NkjGHX2CEadAAAAAAAAAODS4A/T4WAtTtCfJgAAAABJRU5ErkJggg=="
            />
          </defs>
        </svg>
      )}
      {label === "Excel" && (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <rect width="24" height="24" fill="url(#pattern0_279_1828)" />
          <defs>
            <pattern
              id="pattern0_279_1828"
              patternContentUnits="objectBoundingBox"
              width="1"
              height="1"
            >
              <use xlinkHref="#image0_279_1828" transform="scale(0.0111111)" />
            </pattern>
            <image
              id="image0_279_1828"
              width="90"
              height="90"
              xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFGElEQVR4nO2dz4scRRTHW6Mm6iEeRDQqiq6okd2pmt6135s1meseAhGh35vZrC56iKCJSkAN5CDoRT0Z8CTqLRcxoILiH5AfxoMTxUAkoGjAKHhIjILGHys1M4bZnarZ+dE9XdP9vlCnrR8zn/rOq+pX3b1BIBKJRCKRSCQSiUSiwQUQX1ueJyhj7WkF/K4GbijgXzXSbwrpMw20d2phYeMQXRdXsAaqQvpSAf+lkVd6FuBGCeJbs/78+YKKbtiFd3biUNEJe09QFI0NKnYXBXw8yKPCcPfVpfnaAwroMQ10UCMf0cB/jAOqtjv6YpAXVavLmxTWnjEr/ricqgcors+d3Bit3Y5hkNqaYFZ2EwqyhqkzBb3qF3Ry+sFdtyUK2cye75D1uEG3YSfqbIX8bNYQtY+gm7Bpb2KgNfDnWUPUnoJOdLejkH/PGqL2FHSiu52sAWqfQfcYV0CjgF4RR3sQGnTCP+F++tGV2haN/KJG/lNCB6YHuqOugS0xWqcMem4uvllAY/qONikIAY3pg1bI+wU0FmgxVMhfBcFLV9ral6o7bzApxp7tgf/WEE/Z2iuM66PsOnzb7YwEulkifsTdB73duz0dsrWrVqtXaeDTAroTFtDXTldXYtUL1gzWtHWCgJ4c1Vn5c3TL1ezqRwEft7YB/th1oqORzgpoewj4xvzcHRP2qKPNdlv9EvDzSTgrn442pRIv2fqZWljYqIF+7qxrzuBsdcMw3qyQfxHQPUAr5DMuVyugV1fVrfBO6+QCvZy2syZye9dd4idsfZUivrO5lWvVOxUEwRVr68zg0k0moe4D6EnIdXxr7v2w9aeQP2q6GeJl63hAb4wjVg4EuuVsL0GvlJF3W/uLmM3xWBjuuK57rMU7hr0RJ6nvNXG5DoX0g+04PgzjzRr5PdtYzdtzhxwvqe81mbkOx82Hsw8t3tU1TsT3d8RvL0BPwGLYdjXQj+bmx37GUUiHRxkrjc+fxgSnAtqUMtBz645Rqc1q5H8F9Eiw6aeZmaXre4FWwJ+m5azCOFojnbXtMFaDpjcF9IigFfDiepNpLlJaDwKJo4cDDfSFK3Xa7Wp+RUAPHza2205cQqzfl0QiaZRYmZ/tHdAH1v4iZh3xPsff9vkE2vtch0K6NF2J77X1p4DfV8DHnI9vAH/vHWhvcx1AB219hRW++/+rvxLQvH08etw30F7mOhTy+TCs32jtC/itDtd/aKsTx/EGk0L1CbSfuQ6gF2z9hNt23bI6M0f/mPyGrW4J6WEfQHu8GNJ3Js7a+6HXu9wP/I5zXKCjSYAeJgylOcFODRY24rqtj7C1dTvfXZ8uzc7y7bY25QpvE9B20CdsR1NGOuID7snh1wKHNNIn4ug1wIwD3U/c8jk3aLpgLmJsbUOIp5uxXELHZViHXa5USE8Nu4C2XX1IQLfjrIrq97i2agr5zPqxnc+5FlFzct7POWKhFsMsS5DQ95qQ7V2+QHuf68gb6Dl5hoWLm+vIo6OVl7mOHIHWshhy36B9m+CBZ963EghoFtD9Obr3o2tFdrRCupBk6DiRNURdkFf9yMurcAyv6mw95MMns3as9s3RwI2tW+NrEgN9eT8J3MgapvYFdJqvU247e09hX5kJfNHcj2IYJO7kSXkJrEpy9fdd5s7+MKpF5kTFnG6buC6vNc4bfCjQi7ozgw8prP55FQwLX/6ZwuiqVpc3rYHfaD66nMXqLxKJRCKRSCQSiURBTvUfMpmkdxCg0LYAAAAASUVORK5CYII="
            />
          </defs>
        </svg>
      )}
      {label === "PDF" && (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <rect width="24" height="24" fill="url(#pattern0_279_1833)" />
          <defs>
            <pattern
              id="pattern0_279_1833"
              patternContentUnits="objectBoundingBox"
              width="1"
              height="1"
            >
              <use xlinkHref="#image0_279_1833" transform="scale(0.0111111)" />
            </pattern>
            <image
              id="image0_279_1833"
              width="90"
              height="90"
              xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEhElEQVR4nO3dS4gcZRAH8BbBB+pBUHzEixIQFne7aibZqRo2LF4kggYvX9WYCIqgQYhGBBXUmygBQfEBiuALPYgg4lHFi++AcfVictCDouYgCBpFY9CVb3fW9PR0z85kH1/31/WHgoX5eh6/ra2e7ulJksRisVgsFovFYrFYYs78/M1nAet+ZD2ILL8j62LAOo4kH6fkZpOYMj275zJg+Sow7mK+gOTPtKvXJPF0cvWQMTbs/rgIDoqxYy/P5PCYGDs2kh6rFCjrH1Fih4bFXLW6umPkL5/0rxbrdUndEhoWc+WfU5TYVYSOEruq0NFhVxk6KuyqQ0eDXQfoKLDrAl177DpB1xq7btC1xa4jdC2x6wpdO+w6Q9cKu+7QtcGOAdon7crVq55iDfkZZGhYzFe3d+lGYfsPfJNQCQ7LQ3X/Wl7PKtjHk1CpAOxiHsNjb1RnJ6FSAdjFzSyDZoMO3oVoHa3B4Wx0cHhUm9Fs0ME7Dq2jNTiSjQ4OD2gzmqtVdsDCBh28C7EpHQ0kPwHJ+8jyErA8DSQHgOQZJH0LWA8hyz+F2y2d2JF3kfU1YH22v90BYH0CSF8Fls/Ktj15H/IzsH4+TvVPSNUTGkg+WO0+UnJbkPT5oe1JF1bbtr1jzyXI+mgZEpC+MO5rAdLvooZeCXb0nkmhV9ImaSHJLwadSbt94wXTc7vPTwqCJO+cCvTS/XbcXH6UNLajkeS+zAw+1CY3nb0dOnptGXTa0VuQ9V9g+RtIDqddd1vB83llFHSL5G5kfa+o/OeCUULj8s7q6+ztW3fuPNNDFkEjyd6CHeb+gTXd3rZR0MD63Dg78Oig0a+Zcxdm1/h3KWNDk/42M3PTOZllpyHrDwZNw9B+R5aDPjwu9FJ1ersGtmd526BpGHpm1l0+CKVHJ4PWB3PrHjNoys1okm/8n/sK0tS8OxdIT0wCDSyPZ9elpPdOvDMkPRLtjAbWo0BuPnf79WXvOkqhSV/MroOO3lEGXfo6SPdFBZ2S25Ky3OCvnfDdm7+/5UP1yaCR9eXsuhbr7Y2HHpUhyFMcHdkjzMZ2dFGmptwZQPrA/7N54o6WhwbWsTxSujP0j1N4Ukm+jwq6TW4aWJ2/DBbZ3QqsTwHJj4XbjwndIie55/RGKXSTD1iwrMY7YDmxfbu7eHDdyXcQBs3rBM3y+uAatzX3i7COxrVCkx7JdzOQPmzQydpGB7B2/XvmpeLeXVd2d52Xvf2qTu+i/FckrKN5cuhRIXJnI+tHBTPcRgeuE/S2ud1XAOuHxTvjhkAjyRetjmuvFJI8Oe6L8ueq/Qx2zp1e1MH+21T9D3lLv1Hlz+RlHx9Y3owTep0KWH7155mB5Nv+z5vyuI2DxoqUQbNBB+9CtI7W4HA2Ojg8qs1oNujgHYfW0RocyUYHhwe0Gc3VqnAHLBX796NxA8sf+oc8MjzYGGjST4NB+xPwoQFws4p0XzBof5ktkn7ZAOQFf1lEEvr/YYkam3TBX2GVVCHLnS13+jkWxQ6S9BiQfuLHRfBOtlgsFovFYkkmyX/SMDOUfX6Q0AAAAABJRU5ErkJggg=="
            />
          </defs>
        </svg>
      )}
      {label === "Print" && (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <rect width="24" height="24" fill="url(#pattern0_279_1838)" />
          <defs>
            <pattern
              id="pattern0_279_1838"
              patternContentUnits="objectBoundingBox"
              width="1"
              height="1"
            >
              <use xlinkHref="#image0_279_1838" transform="scale(0.0111111)" />
            </pattern>
            <image
              id="image0_279_1838"
              width="90"
              height="90"
              xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB+0lEQVR4nO2cPU7EMBBGXQF3gJIKCeFpkKfalgtgI1FwAX6uARfjpwIOAdRo6RdZUEFDksXj2X1Pmv7L20+TjeQkBAAAAAAAAAAA+MXe3vFG1HITU34VLQvPE1N+iSlf12vq7qeuwawFyfKFX4feWIUmy0/RWt5Cb1hLkX+a0BvWQgTR9rJotNqLZHVoHxN6w1qIrItoAAAAgGnMZmdbUcuVaHkQzR/Wf7ekm8kfUfN91JPL3aOjzUmS9w9Pd6LmZ/uLKn1PKk/V1YQmI1kGyB7V7O91Yd8WdTQpXwwW/bWTOwivfiamcjdcdCpz6+DibVKZj2m0fXD1N4hWRC+sW0ij1V4cq0PtpbKjFdEL68bRaLWXxOpQe4HsaO1reGBRRC+sW7gSjQ5OEES3AdGNQHQjEN0IRDcC0Y1AdCMQ3QhENwLRjUB0IxDdCEQ3AtErL3pJZ++CE2QJ1xo1v5udJg3rJDqNOE1aXxlAdBkmO5XzwaLr6fV6ip1Gl79Kfhz9aaD6XsZU2cEJMmVtpPJ4kI63JwX4ana+qPtnzA0yOEGGy53HVG7rumj6katVFR16w01Q7/ndBPWe301Q7/ndBPWe301Q7/ndBPWe301Q7/ndBPWef/CTlfqY0BvWQgTR9rJotNqLZHVoHxN6w1qIrItoAAAAAACAsGQ+ATu13m67/arCAAAAAElFTkSuQmCC"
            />
          </defs>
        </svg>
      )}
      {label === "Print Barcode" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-upc-scan mt-1"
          viewBox="0 0 16 16"
        >
          <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5M.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5M3 4.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0z" />
        </svg>
      )}
    </div>
  );
};

export default ButtonExport;
