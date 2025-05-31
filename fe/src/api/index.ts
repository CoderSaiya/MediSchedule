import {BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import {RootState} from "@/store";
import {TokenResponse} from "@/types/auth";
import type {Response} from "@/types"
import { setCredentials, updateAccessToken, logout } from "@/store/slices/authSlice";
import {Specialty, SpecialtyWithDoctor} from "@/types/specialty";
import {GetTimeSlotsParams, TimeSlot} from "@/types/slot";
import {MomoRequest, PaymentData, PaymentStatusResponse} from "@/types/payment";
import {CreateAppointmentRequest, CreateAppointmentResponse} from "@/types/appointment";
import {Doctor} from "@/types/user";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

console.log(BASE_URL);

const baseQuery = fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.accessToken;

        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }

        return headers;
    },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
    async (args, api, extraOptions) => {
        let result = await baseQuery(args, api, extraOptions);

        if (result.error && result.error.status === 401) {
            const refreshToken = (api.getState() as RootState).auth.refreshToken;
            if (!refreshToken) {
                api.dispatch(logout());
                return result;
            }

            const refreshResult = await baseQuery(
                { url: "/Auth/refresh", method: "POST", body: { refreshToken } },
                api,
                extraOptions
            );

            if (refreshResult.data) {
                const { accessToken, refreshToken: newRefresh } = refreshResult.data as TokenResponse;
                api.dispatch(setCredentials({ accessToken, refreshToken: newRefresh }));
                result = await baseQuery(args, api, extraOptions);
            } else {
                api.dispatch(logout());
            }
        }

        return result;
    };

export const api = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        login: builder.mutation<TokenResponse, { username: string; password: string }>({
            query: (credentials) => ({
                url: "Auth/login",
                method: "POST",
                body: credentials,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials(data));
                } catch {
                    // ignore error
                }
            },
        }),
        getSpecialties: builder.query<Response<Specialty[]>, void>({
            query: () => ({ url: "Specialty", method: "GET" }),
        }),
        getSpecialtiesWithDoctor: builder.query<Response<SpecialtyWithDoctor[]>, void>({
            query: () => ({url: "Specialty/with-doctors", method: "GET"})
        }),
        getTimeSlots: builder.query<Response<TimeSlot[]>, GetTimeSlotsParams>({
            query: ({ doctorId, date }) => ({
                url: `Slot?doctorId=${doctorId}&date=${date}`,
                method: "GET",
            }),
        }),
        createMomoPayment: builder.mutation<Response<PaymentData>, MomoRequest>({
            query: (request) => ({
                url: "Payment/momo/create-intent",
                method: "POST",
                body: request,
            }),
        }),
        checkPaymentStatus: builder.query<Response<PaymentStatusResponse>, string>({
            query: (orderId) => ({
                url: `Payment/status/${orderId}`,
                method: "GET",
            })
        }),
        createAppointment: builder.mutation<Response<string>, CreateAppointmentRequest>({
            query: (request) => ({
                url: "Appointment",
                method: "POST",
                body: request,
            })
        }),
        uploadToBlob: builder.mutation<Response<{ url: string }>, { file: Blob; containerName: string; appointmentId?: string | null }>({
            query: ({ file, containerName, appointmentId }) => {
                const formData = new FormData()
                formData.append('file', file, `Phiếu-Khám-${appointmentId}.png`)
                formData.append("containerName", containerName)
                return {
                    url: `Public/storage/${appointmentId}`,
                    method: "POST",
                    body: formData,
                }
            },
        }),
        getDoctors: builder.query<Response<Doctor[]>, void>({
            query: () => ({
                url: `Public/doctors`,
                method: "GET",
            })
        })
    }),
});


export const {
    useGetSpecialtiesQuery,
    useGetSpecialtiesWithDoctorQuery,
    useGetTimeSlotsQuery,
    useCreateMomoPaymentMutation,
    useCheckPaymentStatusQuery,
    useCreateAppointmentMutation,
    useUploadToBlobMutation,
    useGetDoctorsQuery,
} = api;