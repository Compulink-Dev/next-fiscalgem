// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { fiscalizationSchema } from '@/lib/schemas/fiscalizationSchema';


// const FiscalizationForm = () => {
//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//     } = useForm({
//         resolver: zodResolver(fiscalizationSchema),
//     });

//     const onSubmit = async (data: any) => {
//         console.log(data);
//     };

//     return (
//         <form onSubmit={handleSubmit(onSubmit)}>
//             <div>
//                 <label>Invoice Number</label>
//                 <input {...register("invoiceNumber")} />
//                 {errors.invoiceNumber && <span>
//                     {errors.invoiceNumber.message}
//                 </span>}
//             </div>
//             <div>
//                 <label>Total Amount</label>
//                 <input type="number" {...register("totalAmount")} />
//                 {errors.totalAmount && <span>{errors.totalAmount.message}</span>}
//             </div>
//             <div>
//                 <label>Tax Amount</label>
//                 <input type="number" {...register("taxAmount")} />
//                 {errors.taxAmount && <span>{errors.taxAmount.message}</span>}
//             </div>
//             <button type="submit">Submit</button>
//         </form>
//     );
// };

// export default FiscalizationForm;
