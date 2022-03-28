import * as React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import { gql, useMutation } from "@apollo/client";

const CreateCard = gql`
  mutation CreateCard($input: CreditCardInput) {
    createCard(input: $input) {
      id
      amount
    }
  }
`;

export default function PaymentForm() {
  const [value, setValue] = React.useState(null);
  const [exReq, { mutData, loading, error }] = useMutation(CreateCard);
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({ mode: "onBlur" });

  const onClick = (data) => {
    exReq({
      variables: {
        input: {
          cardNumber: data.cardNumber,
          expirationDate: data.expDate,
          CVV: data.cvv,
          amount: Number(data.amount),
        },
      },
    }).then((res) => console.log(JSON.stringify(res))); // json ответ - куда отправлять незнаю...пускай в консоль падает
  };

  return (
    <React.Fragment>
      <Container maxWidth="sm">
        <Grid item xs={12} md={6}>
          <TextField
            {...register("cardNumber", {
              required: "Обязательно к заполнению",
              pattern: {
                value: /[0-9]{16}/,
                message: "Поле должно быть 16-значное",
              },
              maxLength: {
                value: 16,
                message: "Поле должно быть 16-значное",
              },
            })}
            id="cardNumber"
            label="Card number"
            fullWidth
            variant="standard"
            type={"number"}
            helperText={errors?.cardNumber && errors?.cardNumber?.message}
            error={errors?.cardNumber ? true : false}
          />
        </Grid>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            value={value}
            inputFormat={"mm/yyyy"}
            mask={"__/____"}
            onChange={(newValue) => {
              setValue(newValue);
            }}
            disableOpenPicker={true}
            renderInput={(params) => (
              <TextField
                {...params}
                {...register("expDate", {
                  required: true,
                  minLength: 7,
                })}
                id="expDate"
                label="Expiration date"
                fullWidth
                variant="standard"
              />
            )}
          />
        </LocalizationProvider>
        <Grid item xs={12} md={6}>
          <TextField
            {...register("amount", { required: true })}
            id="amount"
            label="Amount"
            fullWidth
            variant="standard"
            type={"number"}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            {...register("cvv", {
              required: true,
              minLength: {
                value: 3,
                message: "Поле должно быть 3-значное",
              },
              maxLength: {
                value: 3,
                message: "Поле должно быть 3-значное",
              },
            })}
            id="cvv"
            label="CVV"
            fullWidth
            variant="standard"
            type={"number"}
            error={errors?.cvv ? true : false}
            helperText={errors?.cvv && errors?.cvv?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={handleSubmit(onClick)}
            disabled={!isValid}
          >
            Payment
          </Button>
        </Grid>
      </Container>
    </React.Fragment>
  );
}
