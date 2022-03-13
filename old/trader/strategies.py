import backtrader as bt
import math


class PrintClose(bt.Strategy):
    def __init__(self):
        # Keep a reference to the "close" line in the data[0] dataseries
        self.dataclose = self.datas[0].close

    def log(self, txt, dt=None):
        dt = dt or self.datas[0].datetime.date(0)
        print(f'{dt.isoformat()} {txt}')  # Print date and close

    def next(self):
        self.log('Close, %.2f' % self.dataclose[0])


# simple moving average
class SimpleMA(bt.Strategy):
    def __init__(self):
        self.sma = bt.indicators.SimpleMovingAverage(self.data, period=20,
                                                     plotname="20 SMA")


# Xu huon thi truong
class BtcSentiment(bt.Strategy):
    params = (('period', 10), ('devfactor', 1),)

    def log(self, txt, dt=None):
        dt = dt or self.datas[0].datetime.date(0)
        print(f'{dt.isoformat()} {txt}')

    def __init__(self):
        self.btc_price = self.datas[0].close
        self.google_sentiment = self.datas[1].close
        self.bbands = bt.indicators.BollingerBands(self.google_sentiment,
                                                   period=self.params.period, devfactor=self.params.devfactor)

        self.order = None

    def notify_order(self, order):
        if order.status in [order.Submitted, order.Accepted]:
            # Existing order - Nothing to do
            return

        # Check if an order has been completed
        # Attention: broker could reject order if not enough cash
        if order.status in [order.Completed]:
            if order.status in [order.Completed]:
                if order.isbuy():
                    self.log(f'BUY EXECUTED, {order.executed.price:.2f}')
                elif order.issell():
                    self.log(f'SELL EXECUTED, {order.executed.price:.2f}')
                self.bar_executed = len(self)

        elif order.status in [order.Canceled, order.Margin,
                              order.Rejected]:
            self.log('Order Canceled/Margin/Rejected')

        # Reset orders
        self.order = None

    def next(self):
        # Check for open orders
        if self.order:
            return
            # Long signal
            if self.google_sentiment > self.bbands.lines.top[0]:
                # Check if we are in the market
                if not self.position:
                    self.log(
                        f'Google Sentiment Value: {self.google_sentiment[0]:.2f}')
                    self.log(f'Top band: {self.bbands.lines.top[0]:.2f}')
                    # We are not in the market, we will open a trade
                    self.log(f'***BUY CREATE {self.btc_price[0]:.2f}')
                    # Keep track of the created order to avoid a 2nd order
                    self.order = self.buy()

            # Short signal
            elif self.google_sentiment < self.bbands.lines.bot[0]:
                # Check if we are in the market
                if not self.position:
                    self.log(
                        f'Google Sentiment Value: {self.google_sentiment[0]:.2f}')
                    self.log(
                        f'Bottom band: {self.bbands.lines.bot[0]:.2f}')
                    # We are not in the market, we will open a trade
                    self.log(f'***SELL CREATE {self.btc_price[0]:.2f}')
                    # Keep track of the created order to avoid a 2nd order
                    self.order = self.sell()

            # Neutral signal - close any open trades
            else:
                if self.position:
                    # We are in the market, we will close the existing trade
                    self.log(
                        f'Google Sentiment Value: {self.google_sentiment[0]:.2f}')
                    self.log(
                        f'Bottom band: {self.bbands.lines.bot[0]:.2f}')
                    self.log(f'Top band: {self.bbands.lines.top[0]:.2f}')
                    self.log(f'CLOSE CREATE {self.btc_price[0]:.2f}')
                    self.order = self.close()


# New Class to define the content of the strategy
class EMAStack(bt.Strategy):
    # Define the parameters of the strategy
    params = (
        ('portfolio_expo', 0.10),  # Max 15% of the Portfolio per trade
        ('trade_risk', 0.02),  # Max 2% risk per trade (stop loss)
        ('atrdist', 3.0)  # ATR based Stop loss distance
    )

    def notify_order(self, order):
        if order.status == order.Completed:
            pass

        if not order.alive():
            self.order = None  # indicate no order is pending

    # Initialize the elements which are needed for the strategy (indicators, etc...)
    def __init__(self):

        # Define the indicators
        self.ema50 = bt.indicators.EMA(self.data.close, period=10)
        self.ema200 = bt.indicators.EMA(self.data.close, period=30)
        self.atr = bt.indicators.ATR(period=14)

        # Define the crossover signals
        self.bull_cross = bt.indicators.CrossOver(self.ema50, self.ema200)
        self.bull_cross.plotinfo.subplot = False

        self.bear_cross = bt.indicators.CrossOver(self.ema200, self.ema50)
        self.bear_cross.plotinfo.subplot = False

    def start(self):
        self.order = None  # sentinel to avoid operations on pending order

    def prenext(self):
        self.next()

    def next(self):

        # Get the Amount of cash in the Portfolio
        cash = self.broker.get_cash()

        if self.order:
            return  # pending order execution

        if not self.position:  # check if we already have an open position on the stock

            if self.bull_cross > 0.0:

                # Calculation of the Stock Qty to buy depending on our risk strategy
                pdist = self.atr[0] * self.p.atrdist
                self.pstop = self.data.close[0] - pdist
                qty = math.floor((cash * self.p.trade_risk) / pdist)

                portfolio_exposure_calc = qty * self.data.close[0]
                portfolio_exposure_strategy = cash * self.p.portfolio_expo

                if portfolio_exposure_calc <= portfolio_exposure_strategy:
                    self.order = self.buy(size=qty)
                else:
                    qty = math.floor(
                        portfolio_exposure_strategy / self.data.close[0])
                    self.order = self.buy(size=qty)

            elif self.bear_cross > 0.0:

                # Calculation of the Stock Qty to buy depending on our risk strategy
                pdist = self.atr[0] * self.p.atrdist
                self.pstop = self.data.close[0] - pdist
                qty = math.floor((cash * self.p.trade_risk) / pdist)

                portfolio_exposure_calc = qty * self.data.close[0]
                portfolio_exposure_strategy = cash * self.p.portfolio_expo

                if portfolio_exposure_calc <= portfolio_exposure_strategy:
                    self.order = self.sell(size=qty)
                else:
                    qty = math.floor(
                        portfolio_exposure_strategy / self.data.close[0])
                    self.order = self.sell(size=qty)

        else:  # in the market
            pclose = self.data.close[0]
            pstop = self.pstop

            # Add detection if we are already short or long
            if pclose < pstop or self.bear_cross or self.bull_cross:
                self.close()  # stop met - get out
            else:
                pdist = self.atr[0] * self.p.atrdist
                # Update only if greater than
                self.pstop = max(pstop, pclose - pdist)


class SMA(bt.Strategy):
    def __init__(self):
        self.sma = bt.indicators.SimpleMovingAverage(self.data)


class RSI(bt.Strategy):
    def __init__(self):
        self.rsi = bt.indicators.RSI(self.data)
